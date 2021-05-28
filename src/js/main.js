/**
 * main.js
 */

// fancybox
$('[data-fancybox]').fancybox({
	touch: false,
	autoFocus: false,
	backFocus: false,
	closeExisting: true
});

// mask phone
var maskedElements;
window.imaskInit = () => {
	maskedElements = [];
	const createMask = (elements, masksArray) => {
		if (elements.length > 0) {
			const mask = { mask: masksArray };
			elements.forEach(item => {
				maskedElements.push(new IMask(item, mask));
			});
		}
	};
	createMask(
		document.querySelectorAll(".masked"), 
		[{ mask: "+7 (000) 000-00-00" }, { mask: "+7 (000) 000-00-00" }]
	);
};
imaskInit();

$(".masked").click(function(){
	if($(this).val() == ''){
		$(this).val('+7 ');
	}
});