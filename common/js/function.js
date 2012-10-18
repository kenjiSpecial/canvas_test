function exponetialEasing(val) {
	return (maxVal * (1 - Math.pow(2, 10 * (val / maxVal - 1))));
}
