import colorsys
import numpy as np
from PIL import Image

seed = 1
period = 7
amplitude = 1
frequency = 1 / (2 ** 7 * period)
box = list(map(np.uint64, [158, 163, 200, 235, 223, 47, 250, 35, 101, 191, 5, 132, 161, 71, 142, 18, 7, 133, 176, 253, 246, 207, 117, 233, 138, 92, 74, 16, 187, 10, 91, 249, 94, 210, 80, 167, 13, 136, 202, 150, 62, 126, 160, 162, 186, 22, 108, 124, 112, 21, 232, 14, 148, 127, 218, 143, 214, 220, 39, 57, 190, 144, 159, 130, 88, 2, 154, 242, 81, 24, 111, 147, 66, 54, 238, 28, 37, 63, 45, 153, 169, 102, 208, 247, 226, 48, 79, 27, 183, 145, 184, 228, 180, 89, 56, 20, 11, 170, 40, 84, 152, 198, 55, 103, 237, 221, 178, 174, 8, 29, 90, 122, 205, 155, 12, 67, 30, 96, 243, 43, 254, 26, 44, 15, 193, 251, 59, 4, 78, 129, 137, 31, 203, 1, 219, 70, 181, 236, 157, 72, 225, 104, 194, 222, 53, 0, 241, 85, 131, 192, 6, 9, 114, 46, 248, 95, 240, 121, 128, 244, 239, 107, 19, 201, 25, 149, 116, 105, 34, 175, 76, 224, 146, 51, 139, 41, 75, 204, 52, 23, 171, 68, 196, 164, 50, 77, 245, 229, 134, 106, 252, 217, 115, 33, 188, 97, 61, 227, 86, 87, 82, 32, 166, 17, 98, 93, 60, 231, 140, 172, 125, 195, 212, 206, 73, 177, 3, 69, 58, 199, 118, 141, 209, 197, 109, 173, 123, 211, 135, 189, 151, 110, 213, 83, 38, 113, 216, 119, 179, 99, 36, 42, 120, 255, 185, 64, 168, 230, 49, 234, 165, 65, 156, 215, 182, 100]))
noiseValues = np.zeros(period * period)

def slash(key):
	result = np.uint64(key)
	result = (box[result & np.uint64(0xFF)]) | (box[(result >> np.uint64(8)) & np.uint64(0xFF)] << np.uint64(8)) | (box[(result >> np.uint64(16)) & np.uint64(0xFF)] << np.uint64(16)) | (box[(result >> np.uint64(24)) & np.uint64(0xFF)] << np.uint64(24)) | (box[(result >> np.uint64(32)) & np.uint64(0xFF)] << np.uint64(32)) | (box[(result >> np.uint64(40)) & np.uint64(0xFF)] << np.uint64(40)) | (box[(result >> np.uint64(48)) & np.uint64(0xFF)] << np.uint64(48)) | (box[(result >> np.uint64(56)) & np.uint64(0xFF)] << np.uint64(56))
	result = result * np.uint64(0xA78ACE24B25835F3)
	result = result ^ (result >> np.uint64(56))
	result = result * np.uint64(0xA785A2A2D742E537)

	return result.item()

def random():
	global seed

	seed = slash(seed)

	return seed

def noise(x, y):
	# Frequency
	x = x * frequency
	y = y * frequency

	# Floor to integer
	xi = int(x)
	yi = int(y)

	# Find period values
	xp = xi % period
	yp = yi % period

	# Find output values
	oa = noiseValues[xp * period + yp]
	ob = noiseValues[xp * period + (yp if yp == period - 1 else yp + 1)]
	oc = noiseValues[(xp if xp == period - 1 else xp + 1) * period + (yp if yp == period - 1 else yp + 1)]
	od = noiseValues[(xp if xp == period - 1 else xp + 1) * period + yp]

	# Map x, y -> [0, 1]
	x = x - xi
	y = y - yi

	# Smoothly map x : [0, 1] -> [oa, od]
	oad = x * x * x * (x * (x * (6 * od - 6 * oa) + (15 * oa - 15 * od)) + (10 * od - 10 * oa)) + oa

	# Smoothly map x : [0, 1] -> [ob, oc]
	obc = x * x * x * (x * (x * (6 * oc - 6 * ob) + (15 * ob - 15 * oc)) + (10 * oc - 10 * ob)) + ob

	# Smoothly map y : [0, 1] -> [oad, obc] & Amplify
	return (y * y * y * (y * (y * (6 * obc - 6 * oad) + (15 * oad - 15 * obc)) + (10 * obc - 10 * oad)) + oad) * amplitude

for i in range(period * period):
	noiseValues[i] = random() / 0xFFFFFFFFFFFFFFFF

size = 1024
color1 = (5/7, 3/7, 1)
color1_rgb = np.array(colorsys.hls_to_rgb(*color1))
color2 = (3/7, 3/7, 1)
color2_rgb = np.array(colorsys.hls_to_rgb(*color2))
colors = []
steps = 7
delta = np.subtract(color2_rgb, color1_rgb) / (steps - 1)
image = np.zeros((size, size, 3))

for step in range(steps):
	colors.append(step * delta + color1_rgb)

for x in range(size):
	for y in range(size):
		value = noise(x, y)
		index = int(value * steps)
		image[y, x] = colors[index] * 255

Image.fromarray(image.astype("uint8")).save("topography.png")
