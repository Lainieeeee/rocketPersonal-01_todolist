// ============================================
// 共通APIを定義
// ============================================
const apiUrl = "https://todoo.5xcamp.us";

// ============================================
// 註冊帳號 POST(https://todoo.5xcamp.us/users)
// ============================================
// 「註冊帳號」ボタンを定義
const signUpBtn = document.getElementById("signUpBtn");
// 「註冊帳號」をクリックしたときに以下を実行
if (signUpBtn) {
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
            // サーバーにユーザー情報をPOST送信
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
}

// ============================================
// 登入 POST(https://todoo.5xcamp.us/users/sign_in)
// ============================================
// 「登入」ボタンを定義
const loginBtn = document.getElementById("loginBtn");
// 「登入」をクリックしたときに以下を実行
if (loginBtn) {
    loginBtn.addEventListener("click", async (e) => {

        // フォームのデフォルトの送信を防止
        e.preventDefault();
    
        // フォームから入力された情報を取得
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
    
        // 入力内容が空でないかチェック
        if (!email || !password) {
            return alert("Email 或者密碼未輸入");
        }
    
        try {
            // サーバーにユーザー情報をPOST送信
            const response = await fetch(`${apiUrl}/users/sign_in`, {
                method: "POST",  // POSTメソッドを使う
                headers: { "Content-Type": "application/json" },  // リクエストボディの形式をJSONに指定
                body: JSON.stringify({ user: { email, password } })  // ログイン情報をJSON形式に変換して送信
            });
    
            // サーバーからのレスポンスをJSONとして解析
            const result = await response.json();
    
            // レスポンスが正常であればログイン成功メッセージを表示
            if (response.ok) {
                console.log("登錄成功！");

                // tokenを取得
                const token = response.headers.get("Authorization");  // ヘッダーからtokenを取得
                // console.log(token); // tokenが正常に取得できているかconsole.logで確認
                const expires = new Date();
                expires.setTime(expires.getTime() + (1 * 60 * 60 * 1000)); // 1時間後に期限を設定
                document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/`; // 取得したtokenをcookieとして定義

                window.location.href = "toDoList.html";  // toDoListページにリダイレクト

            } else {
                alert(`登錄失敗: ${result.error}`);
            }
        } catch (error) {
            console.error(error);
            alert("登錄時發生錯誤");
        }
    });
}