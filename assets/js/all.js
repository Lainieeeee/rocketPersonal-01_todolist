// ============================================
// 共通APIを定義
// ============================================
const apiUrl = "https://todoo.5xcamp.us";

// ============================================
// 註冊帳號
// ============================================
// 「註冊帳號」ボタンを定義
const signUpBtn = document.getElementById("signUpBtn");
// 「註冊帳號」をクリックしたときに以下を実行
signUpBtn.addEventListener("click", async (e) => {

    // フォームのデフォルトの送信を防止
    e.preventDefault();

    // フォームから入力された情報を取得
    const email = document.getElementById("email").value;
    const nickname = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    const password02 = document.getElementById("password02").value;

    // パスワードが一致しているか確認
    if (password !== password02) {
        return alert("密碼不一致");
    }

    try {
        // サーバーに対してユーザー情報をPOSTリクエストで送信
        const response = await fetch(`${apiUrl}/users`, {
            method: "POST", // POSTメソッドを使う
            headers: { "Content-Type": "application/json" },  // リクエストボディの形式をJSONに指定
            body: JSON.stringify({ user: { email, nickname, password } })  // ユーザー情報をJSON形式に変換して送信
        });

        // サーバーからのレスポンスをJSONとして解析
        const result = await response.json();

        // レスポンスが正常であればログイン成功メッセージを表示
        if (response.ok) {
            alert("登錄成功！");
            window.location.href = "index.html";  // ログインページにリダイレクト
        } else {
            alert(`登錄失敗: ${result.error}`);
        }
    } catch (error) {
        console.error(error);
        alert("登錄時發生錯誤");
    }
});

// ============================================
// 
// ============================================