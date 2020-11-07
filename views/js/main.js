$(document).ready(function(){
  $('.delete-voter').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/voters/'+id,
      success: function(response){
        alert('Deleting Voter') ;
        window.location.href='/admins';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});
