$(function(){
    
    var timer;
    var timeout = 500;
    var input = $('#code_input');
    
    input.keyup(function(){
        clearTimeout(timer);
        if (input.val()){
            timer = setTimeout(analyzeCode, timeout);
        }
    });
    
    input.keydown(function(){
        clearTimeout(timer);
    });
    
    function analyzeCode(){
        var input_html = input.serialize();
        $.ajax({
          type: 'POST', url: '/', data: input_html 
        }).done(function(messages){
            $('#feedback').empty();
            var list = [];
            for (var i=0; i<messages['whiteList'].length; i++){
                console.log(messages['whiteList'][i]);
                list.push($('<li>', {html: messages['whiteList'][i]}));
            }
            for (var i=0; i<messages['blackList'].length; i++){
                list.push($('<li>', {html: messages['blackList'][i]}));
            }
            if (messages["structure"]){
                list.push($('<li>', {html: messages['structure']}));    
            }
            $('#feedback').append(list);
        });        
    }

    // $('form').on('submit', function(e){
    //     e.preventDefault();
    //     var form = $(this);
    //     var formData = form.serialize();
    //     $.ajax({
    //       type: 'POST', url: '/', data: formData 
    //     }).done(function(messages){
    //         $('#feedback').empty();
    //         var list = []
    //         for (var i=0; i<messages['whiteList'].length; i++){
    //             console.log(messages['whiteList'][i]);
    //             list.push($('<li>', {html: messages['whiteList'][i]}));
    //         }
    //         for (var i=0; i<messages['blackList'].length; i++){
    //             list.push($('<li>', {html: messages['blackList'][i]}));
    //         }
    //         list.push($('<li>', {html: messages['structure']}));
    //         $('#feedback').append(list);
    //     });
    // });
});