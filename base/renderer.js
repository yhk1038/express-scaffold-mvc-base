function extract_memberVariables(args) {
  const mem = {},
      keys = Object.keys(args);
  
  for (let key of keys) {
    if (key != 'contentFor' && key != '_locals') {
      mem[key] = args[key]
    }
  }

  return mem
}

// // [Classified] <~ (res object methods) Descriptions, (It's Express.JS OFFICIAL)
// //     > Available using examples in your own controllers.

// [render :html] <~ res.render()	보기 템플리트를 렌더링합니다.
//    > render(path, req, res, __);
//    > render(['html', path], req, res, __);
//    > render({format: 'html', template_path: path}, req, res, __);
//    > render({format: 'html', template_path: path, data: __}, req, res);

// [render :json] <~ res.json()	JSON 응답을 전송합니다.
//    > render('json', req, res, __.data);
//    > render(['json', path], req, res, __.data);
//    > render({format: 'json', template_path: path}, req, res, __.data);
//    > render({format: 'json', template_path: path, data: __.data}, req, res);

// [render :jsonp] <~ res.jsonp()	JSONP 지원을 통해 JSON 응답을 전송합니다.
//    > render('jsonp', req, res, __.data);
//    > render(['jsonp', path], req, res, __.data);
//    > render({format: 'jsonp', template_path: path}, req, res, __.data);
//    > render({format: 'jsonp', template_path: path, data: __.data}, req, res);

// [render :send] <~ res.send()	다양한 유형의 응답을 전송합니다.

// [render :file] <~ res.sendFile	파일을 옥텟 스트림의 형태로 전송합니다.
//    > render({format: 'file', template_path: path}, req, res);
//    > render(['file', path], req, res);

// [render :file] <~ res.download()	파일이 다운로드되도록 프롬프트합니다.
//    > render({format: 'file', template_path: path, download: true}, req, res);

// [render :status] <~ res.sendStatus()	응답 상태 코드를 설정한 후 해당 코드를 문자열로 표현한 내용을 응답 본문으로서 전송합니다.
// [render :exit] <~ res.end()	응답 프로세스를 종료합니다.
//    > render('exit', req, res);

// [redirect] <~ res.redirect()	요청의 경로를 재지정합니다.
//    > redirect(url);



function render(template, req, res, args, options) {
  
  if (typeof template === 'string') {
    let format = template;

    if (format === 'json') {
      res.json(args)
    }
    else if (format === 'jsonp') {
      res.jsonp(args)
    }
    else {
      res.render(template, extract_memberVariables(args))
    }

  }

  else if (template instanceof Array) {
    let [format, template_path] = template;
    
    if (format === 'json') {
      res.json(args)
    }
    else if (format === 'jsonp') {
      res.jsonp(args)
    }
    else {
      res.render(template_path, extract_memberVariables(args))
    }

  }

  else if (template instanceof Object && !(tempalte instanceof Array)) {
    let {format: format, template_path: template_path} = template;

    if (format === 'json') {
      res.json(args)
    }
    else if (format === 'jsonp') {
      res.jsonp(args)
    }
    else {
      res.render(template_path, extract_memberVariables(args))
    }
  }

  else {
    res.render(template_path, extract_memberVariables(args))
  }
  
}


function redirect(url, req, res, args, options) {
  res.redirect(url)
}
let __ = {};
module.exports = [ render, redirect, __ ]