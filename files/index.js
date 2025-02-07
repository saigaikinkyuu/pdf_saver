const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// クエリパラメータ "name" を取得する
const id = urlParams.get('id');
const name = urlParams.get('name');
let flag = false

fetch("../files.json")
  .then(response => response.json())
  .then(data => {
    let datas = data.active
    fetch("./data.json")
      .then(response => response.json())
      .then(items => {
        let item = items.files
        for(let i = 0;i<item.length;i++){
          if(item[i].key === id && item[i].url === name){
            alert("実行1")
            i += item.length
            for(let s = 0;s<datas.length;s++){
              if(datas[s].url === name){
                alert("実行2")
                s += datas.length
                if(datas[s].sta === "available"){
                  alert("実行3")
                  document.body.innerHTML = "<iframe src='../?req=sh&name=none&url=./files/ac/" + item[i].hrf + "' style='width: 100%;height: 100%;'></iframe>"
                  flag = true
                }
              }
            }
          }
        }
      })
  })

if(flag === false){
  window.location.href = "../error/?code=10001&num=null"
}else{
  return
  const url = new URL(window.location);
  // URLのクエリパラメータを削除
  url.search = '';
  // 新しいURLをヒストリーに追加し、ページをリロードせずにURLを変更
  window.history.pushState({}, document.title, url);
}
