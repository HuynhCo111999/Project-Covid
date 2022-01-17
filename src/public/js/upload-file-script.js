var slideIndex = 1;

$(document).ready(function(){
	addSlideFunction(slideIndex);
	updateSlideFunction(slideIndex);
  });

function addSlideFunction(index){
	var btnUpload = $(`#upload_file_${index-1}`),
		btnOuter = $(`#button_outer_${index-1}`);
		btnUpload.on("change", function(e){
		var ext = btnUpload.val().split('.').pop().toLowerCase();
		if($.inArray(ext, ['gif','png','jpg','jpeg']) == -1) {
			$(`#error_msg_${index-1}`).text("Lỗi không phải file ảnh");
		} else {
			$(`#error_msg_${index-1}`).text("");
			btnOuter.addClass("file_uploading");
			setTimeout(function(){
				btnOuter.addClass("file_uploaded");
			},3000);
			var uploadedFile = URL.createObjectURL(e.target.files[0]);
			setTimeout(function(){
				$(`#uploaded_view_${index-1}`).append('<img src="'+uploadedFile+'" />').addClass("show");	
			},3500);
		}
	});
	$(`#file_remove_${index-1}`).on("click", function(e){
		$(`#uploaded_view_${index-1}`).removeClass("show");
		$(`#uploaded_view_${index-1}`).find("img").remove();
		btnOuter.removeClass("file_uploading");
		btnOuter.removeClass("file_uploaded");
		$(`#error_msg_${index-1}`).text("");
	});
};

function updateSlideFunction(index) {
	var btnUpload = $(`#edit_upload_file_${index-1}`),
		btnOuter = $(`#edit_button_outer_${index-1}`);

		btnUpload.on("change", function(e){
			var ext = btnUpload.val().split('.').pop().toLowerCase();
			if($.inArray(ext, ['gif','png','jpg','jpeg']) == -1) {
				$(`#edit_error_msg_${index-1}`).text("Lỗi không phải file ảnh");
			} else {
				$(`#edit_error_msg_${index-1}`).text("");
				btnOuter.addClass("file_uploading");
				setTimeout(function(){
					btnOuter.addClass("file_uploaded");
				},3000);
				var uploadedFile = URL.createObjectURL(e.target.files[0]);
				setTimeout(function(){
					$(`#edit_uploaded_view_${index-1}`).append('<img src="'+uploadedFile+'" />').addClass("show");
				},3500);
			}
		});

	$(`#edit_file_remove_${index-1}`).on("click", function(e){
		$(`#edit_uploaded_view_${index-1}`).removeClass("show");
		$(`#edit_uploaded_view_${index-1}`).find("img").remove();
		btnOuter.removeClass("file_uploading");
		btnOuter.removeClass("file_uploaded");
		$(`#edit_error_msg_${index-1}`).text("");
	});
};