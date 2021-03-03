$(document).ready(() => {
	$(".button-del").click((e) => {
		e.preventDefault();
		$.ajax({
			url: `/user/notes/${e.target.id}`,
			type: "DELETE",
			success: function () {
				console.log("success del");
			},
		})
			.done(function () {
				window.location.reload();
				// console.log("hello");
			})
			.fail(() => console.log("hahafail"))
			.always(() => console.log("running"));
	});
	$(".text-area").focusout((e) => {
		e.preventDefault();
		$.ajax({
			url: `/user/notes/${e.target.dataset.number}`,
			type: "PUT",
			data: { update: e.target.value },
			success: function () {
				console.log("success");
			},
		})
			.done(function () {
				// window.location.reload();
				console.log("hello");
			})
			.fail(() => console.log("fail again"))
			.always(() => console.log("still running"));
	});
});
