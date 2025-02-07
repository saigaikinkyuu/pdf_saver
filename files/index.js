const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// クエリパラメータ "name" を取得する
const id = urlParams.get('id');
const name = urlParams.get('name');

fetch("../files.json")
  .then(response => response.json())
  .then(data => {
    fetch("./data.json")
      .then(response => response.json())
      .then(items => {
        let item = items.files
        if(let i = 0;i<item.length;i++){
          if(item[i].key === id && item[i].url === name){
            i += item.length
            document.body.innerHTML = "<iframe src='../?req=sh&name=none&url=" + item[i].hrf + "' style='width: 100%;height: 100%;'></iframe>"
          }
        }
      })
  })
