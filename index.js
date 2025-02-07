// 現在のURLからクエリパラメータを取得する
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// クエリパラメータ "name" を取得する
const request_flag = urlParams.get('req');
const file_name = urlParams.get('name');
let flag = false
if(request_flag && file_name){
  flag = true
}

if(flag === true){
  if(request_flag === "get"){
    fetch("./files.json")
      .then(response => response.json())
      .then(data => {
        let files_ac = data.active
        let length_fi = files_ac.length
        let check_flag = false
        let file_info = []
        for(let i = 0;i<length_fi;i++){
          if(check_flag === true){
            i += length_fi
          }else {
            if(files_ac[i].id === file_name){
              check_flag = true
              file_info.push(files_ac[i].url,files_ac[i].sta,files_ac[i].memo,files_ac[i].date,files_ac[i].update,i,files_ac[i].cont.kind)
            }else if(files_ac[i].update){
              if((files_ac[i].old).includes(file_name)){
                check_flag = true
                file_info.push(files_ac[i].url,files_ac[i].sta,files_ac[i].memo,files_ac[i].date,files_ac[i].update,i,files_ac[i].cont.kind)
              }
            }
          }
        }
        if(check_flag){
          if(file_info[1] === "available"){
            if(file_info[2] !== "none"){
              let memo_pre = (file_info[2]).replace("{{date}}",file_info[3])
              let memo = memo_pre.replace("{{update}}",file_info[4])
              let confirm = window.confirm(memo);
              if(confirm === false){
                alert("不明な理由で利用できません")
                window.close()
              }
            }
            const response = await fetch(file_info[0] + '.txt');
            const id = await response.text();
            window.location.href = "./files/?name=" + file_info[0] + "&id=" + id;
          }else if(file_info[1] === "un_available"){
            window.location.href = "./error/?code=00001&num=" + file_info[5];
          }else if(file_info[1] === "limit"){
            window.location.href = "./error/?code=00101&num=" + file_info[5];
          }
        }else {
          window.location.href = "./error/?code=10001&";
        }
      })
  }
}
