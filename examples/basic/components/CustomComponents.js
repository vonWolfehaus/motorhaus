/**
 * We simply list out all of our components in this array, then we have Kai prep them for us to be
 * accessed elsewhere in our game.
 */
define(
	[
		'components/SeekMouse',
		'components/EASELBitmap'
	],
	function() { return mh.Kai.registerComponents(arguments); }
);
