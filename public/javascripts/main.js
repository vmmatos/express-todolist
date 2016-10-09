$(document).ready(function() {
  $('.task-delete').click(function(e) {
    $target = $(e.target)
    $.ajax({
      type: 'DELETE',
      url: '/tasks/' + $target.attr('data-task-id'),
      data: {},
      success: function(response) {
        $target.parent().parent().remove();
        console.log('sucesso - tarefa removida.');
      },
      error: function(error) {
        console.log('ERRO - '+error);
      }
    })
  });
})