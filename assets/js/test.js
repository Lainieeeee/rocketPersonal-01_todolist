// ============================================
// 共通APIを定義〇
// ============================================
const apiUrl = "https://todoo.5xcamp.us";

// ============================================
// 新規登録✖
// ============================================
const register = () => {
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
  
    fetch(`${apiUrl}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => data.message === "success" ? window.location.href = "login.html" : alert('登録失敗'))
    .catch(console.error);
}

// ============================================
// ログイン✖
// ============================================
const login = () => {
    const email = document.querySelector("#email").value; // 入力されたメールを取得
    const password = document.querySelector("#password").value;// 入力されたパスワードを取得
  
    fetch(`${apiUrl}/login/sign_in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => data.token ? localStorage.setItem('token', data.token) && window.location.href = "todolist.html" : alert('ログイン失敗'))
    .catch(console.error);
}

// ============================================
// 認証状態（token）の確認
// ============================================


// ============================================
// ログアウト〇
// ============================================
const logout = () => {
    localStorage.removeItem("token"); // localStorage に保存された "token" を削除
    window.location.href = "index.html"; // ログインページへリダイレクト
}

// ============================================
// ページごとの処理
// ============================================
document.addEventListener("DOMContentLoaded", function () {

    // index.htmlで「登入」ボタンがクリックされた場合の処理
    

    // register.htmlで「註冊帳號」ボタンがクリックされた場合の処理
    

    // toDoList.htmlで「登出」ボタンがクリックされた場合の処理
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            logout(); // ログアウト処理を実行
        });
    }

});