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
                alert("註冊成功！");
                window.location.href = "index.html";  // ログインページにリダイレクト
            } else {
                alert(`註冊失敗: ${result.error}`);
            }
        } catch (error) {
            console.error(error);
            alert("註冊時發生錯誤");
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
                document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/`; // クッキーの有効期限を指定（サイト全体に適用）

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




















// ============================================
// Cookieを取得するためのヘルパー関数
// ============================================
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}
// ============================================
// Cookieを削除するためのヘルパー関数
// ============================================
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`; // pathを合わせる
}
// ============================================
// 登出 DELETE(https://todoo.5xcamp.us/users/sign_out)
// ============================================
// 「登出」ボタンを定義
const logoutBtn = document.getElementById("logoutBtn");
// 「登出」をクリックしたときに以下を実行
// if (logoutBtn) {
//     logoutBtn.addEventListener("click", async (e) => {

//         // フォームのデフォルトの送信を防止
//         e.preventDefault();
    
//         // token情報を取得
//         const token = getCookie("token");
    
//         // tokenが無い場合
//         if (!token) {
//             alert("尚未登入，無法登出");
//             return;
//         }
    
//         try {
//             // サーバーにユーザー情報をDELETE送信
//             const response = await fetch(`${apiUrl}/users/sign_out`, {
//                 method: "DELETE",
//                 headers: { 
//                     "Content-Type": "application/json",  // リクエストボディの形式をJSONに指定
//                     "Authorization": `Bearer ${token}`  // 正しくtokenをヘッダーに設定
//                 },
//             });
    
//             // サーバーからのレスポンスをJSONとして解析
//             const result = await response.json();
    
//             // レスポンスが正常であればログイン成功メッセージを表示
//             if (response.ok) {
//                 console.log("登出成功！");

//                 // tokenを削除
//                 deleteCookie("token");

//                 window.location.href = "index.html";  // ログインページにリダイレクト

//             } else {
//                 alert(`登出失敗: ${result.error}`);
//             }
//         } catch (error) {
//             console.error(error);
//             alert("登出時發生錯誤");
//         }
//     });
// }