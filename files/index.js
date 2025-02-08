function pdfShow(url){
  const loadingTask = pdfjsLib.getDocument(url);
  loadingTask.promise.then(pdf => {
    console.log('PDF loaded');
    // PDFの最初のページを取得
    pdf.getPage(1).then(page => {
      console.log('Page loaded');
      const scale = 1; // スケールを設定
      const viewport = page.getViewport({ scale });
      // Canvas要素とコンテキストを取得
      document.body.innerHTML = "<canvas id='pdfCanvas'></canvas>"
      const canvas = document.getElementById('pdfCanvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = window.innerHeight;
      // 描画の準備
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      // ページを描画
      page.render(renderContext).promise.then(() => {
        console.log('Page rendered');
      });
    });
  }, reason => {
    console.error(reason);
  });
}

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
            for(let s = 0;s<datas.length;s++){
              if(datas[s].url === name){
                if(datas[s].sta === "available"){
                  s += datas.length
                  pdfShow("../files/ac/" + item[i].hrf)
                  document.title = "Contents"
                  flag = true
                }
              }
            }
            i += item.length
          }
        }
        if(flag === false){
          window.location.href = "../error/?code=10001&num=null"
        }else{
          const url = new URL(window.location);
          // URLのクエリパラメータを削除
          url.search = '';
          // 新しいURLをヒストリーに追加し、ページをリロードせずにURLを変更
          window.history.pushState({}, document.title, url);
        }
      })
  })

