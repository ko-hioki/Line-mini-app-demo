// LIFF IDを設定（実際の開発では環境変数や設定ファイルから読み込み）
const LIFF_ID = 'YOUR_LIFF_ID'; // 実際のLIFF IDに置き換えてください

// グローバル変数
let liffInitialized = false;
let userProfile = null;

// DOM要素
const elements = {
    loginBtn: document.getElementById('loginBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    userInfo: document.getElementById('userInfo'),
    userCard: document.getElementById('userCard'),
    profilePicture: document.getElementById('profilePicture'),
    displayName: document.getElementById('displayName'),
    userId: document.getElementById('userId'),
    statusMessage: document.getElementById('statusMessage'),
    scanQrBtn: document.getElementById('scanQrBtn'),
    qrResult: document.getElementById('qrResult'),
    sendMessageBtn: document.getElementById('sendMessageBtn'),
    messageText: document.getElementById('messageText'),
    shareBtn: document.getElementById('shareBtn'),
    shareText: document.getElementById('shareText'),
    getDeviceInfoBtn: document.getElementById('getDeviceInfoBtn'),
    deviceInfo: document.getElementById('deviceInfo'),
    getLocationBtn: document.getElementById('getLocationBtn'),
    locationInfo: document.getElementById('locationInfo'),
    openExternalBtn: document.getElementById('openExternalBtn'),
    externalUrl: document.getElementById('externalUrl'),
    copyToClipboardBtn: document.getElementById('copyToClipboardBtn'),
    clipboardText: document.getElementById('clipboardText'),
    closeWindowBtn: document.getElementById('closeWindowBtn'),
    loading: document.getElementById('loading'),
    messageArea: document.getElementById('messageArea')
};

// ユーティリティ関数
const showLoading = () => elements.loading.style.display = 'flex';
const hideLoading = () => elements.loading.style.display = 'none';

const showMessage = (text, type = 'info') => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    elements.messageArea.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
};

const updateLoginStatus = (isLoggedIn) => {
    if (isLoggedIn) {
        elements.loginBtn.style.display = 'none';
        elements.logoutBtn.style.display = 'inline-block';
        elements.userCard.style.display = 'block';
        elements.userInfo.textContent = `ようこそ、${userProfile?.displayName || 'ユーザー'}さん`;
    } else {
        elements.loginBtn.style.display = 'inline-block';
        elements.logoutBtn.style.display = 'none';
        elements.userCard.style.display = 'none';
        elements.userInfo.textContent = 'ログインしてください';
    }
};

// LIFF初期化
const initializeLiff = async () => {
    try {
        showLoading();
        
        // LIFFが利用可能かチェック（モック環境での対応）
        if (typeof liff === 'undefined') {
            // LIFFが利用できない場合のモック対応
            console.log('LIFF SDK not available, using mock data');
            liffInitialized = true;
            hideLoading();
            showMessage('デモモード: LIFFが利用できないため、モックデータを使用します', 'info');
            updateLoginStatus(false);
            return;
        }
        
        await liff.init({ liffId: LIFF_ID });
        liffInitialized = true;
        
        if (liff.isLoggedIn()) {
            userProfile = await liff.getProfile();
            updateUserProfile();
            updateLoginStatus(true);
            showMessage('ログイン済みです', 'success');
        } else {
            updateLoginStatus(false);
            showMessage('LINEにログインしてください', 'info');
        }
        
    } catch (error) {
        console.error('LIFF initialization failed:', error);
        // エラー時はモックモードで動作
        liffInitialized = true;
        updateLoginStatus(false);
        showMessage('デモモード: LIFF初期化に失敗したため、モックデータを使用します', 'info');
    } finally {
        hideLoading();
    }
};

// ユーザープロフィール更新
const updateUserProfile = () => {
    if (userProfile) {
        elements.profilePicture.src = userProfile.pictureUrl || 'https://via.placeholder.com/60';
        elements.displayName.textContent = userProfile.displayName || 'Unknown';
        elements.userId.textContent = userProfile.userId || 'Unknown';
        elements.statusMessage.textContent = userProfile.statusMessage || '設定されていません';
    }
};

// ログイン処理
const login = async () => {
    try {
        if (typeof liff !== 'undefined' && liffInitialized) {
            liff.login();
        } else {
            // モック対応
            userProfile = {
                displayName: 'デモユーザー',
                userId: 'demo_user_12345',
                pictureUrl: 'https://via.placeholder.com/60/06C755/ffffff?text=DEMO',
                statusMessage: 'デモ用ステータスメッセージ'
            };
            updateUserProfile();
            updateLoginStatus(true);
            showMessage('モックログインが完了しました', 'success');
        }
    } catch (error) {
        console.error('Login failed:', error);
        showMessage('ログインに失敗しました', 'error');
    }
};

// ログアウト処理
const logout = async () => {
    try {
        if (typeof liff !== 'undefined' && liffInitialized) {
            liff.logout();
        }
        userProfile = null;
        updateLoginStatus(false);
        showMessage('ログアウトしました', 'success');
    } catch (error) {
        console.error('Logout failed:', error);
        showMessage('ログアウトに失敗しました', 'error');
    }
};

// QRコードスキャン
const scanQrCode = async () => {
    try {
        if (typeof liff !== 'undefined' && liffInitialized && liff.scanCode) {
            showLoading();
            const result = await liff.scanCode();
            elements.qrResult.innerHTML = `
                <h4>QRコード読み取り結果:</h4>
                <p><strong>値:</strong> ${result.value}</p>
            `;
            showMessage('QRコードを読み取りました', 'success');
        } else {
            // モック対応
            const mockQrData = `https://example.com/demo?id=${Date.now()}`;
            elements.qrResult.innerHTML = `
                <h4>QRコード読み取り結果 (モック):</h4>
                <p><strong>値:</strong> ${mockQrData}</p>
                <p><em>※ これはデモ用のモックデータです</em></p>
            `;
            showMessage('モックQRコードを読み取りました', 'success');
        }
    } catch (error) {
        console.error('QR scan failed:', error);
        showMessage('QRコード読み取りに失敗しました', 'error');
    } finally {
        hideLoading();
    }
};

// メッセージ送信
const sendMessage = async () => {
    const message = elements.messageText.value.trim();
    if (!message) {
        showMessage('メッセージを入力してください', 'error');
        return;
    }
    
    try {
        if (typeof liff !== 'undefined' && liffInitialized && liff.sendMessages) {
            await liff.sendMessages([{
                type: 'text',
                text: message
            }]);
            showMessage('メッセージを送信しました', 'success');
        } else {
            // モック対応
            showMessage(`モック送信: "${message}"`, 'success');
        }
        elements.messageText.value = '';
    } catch (error) {
        console.error('Send message failed:', error);
        showMessage('メッセージ送信に失敗しました', 'error');
    }
};

// コンテンツ共有
const shareContent = async () => {
    const text = elements.shareText.value.trim();
    if (!text) {
        showMessage('共有するテキストを入力してください', 'error');
        return;
    }
    
    try {
        if (typeof liff !== 'undefined' && liffInitialized && liff.shareTargetPicker) {
            await liff.shareTargetPicker([{
                type: 'text',
                text: text
            }]);
            showMessage('コンテンツを共有しました', 'success');
        } else {
            // モック対応
            showMessage(`モック共有: "${text}"`, 'success');
        }
        elements.shareText.value = '';
    } catch (error) {
        console.error('Share failed:', error);
        showMessage('共有に失敗しました', 'error');
    }
};

// デバイス情報取得
const getDeviceInfo = () => {
    try {
        let deviceInfo = '';
        
        if (typeof liff !== 'undefined' && liffInitialized) {
            deviceInfo = `
                <h4>LIFF環境情報:</h4>
                <p><strong>OS:</strong> ${liff.getOS()}</p>
                <p><strong>言語:</strong> ${liff.getLanguage()}</p>
                <p><strong>バージョン:</strong> ${liff.getVersion()}</p>
                <p><strong>LINE バージョン:</strong> ${liff.getLineVersion()}</p>
                <p><strong>LIFF利用可能:</strong> ${liff.isApiAvailable('shareTargetPicker') ? '可能' : '不可'}</p>
                <p><strong>アクセストークン:</strong> ${liff.getAccessToken() ? '取得済み' : '未取得'}</p>
            `;
        } else {
            // モック対応
            deviceInfo = `
                <h4>デバイス情報 (モック):</h4>
                <p><strong>OS:</strong> ${navigator.platform}</p>
                <p><strong>言語:</strong> ${navigator.language}</p>
                <p><strong>ユーザーエージェント:</strong> ${navigator.userAgent.substring(0, 50)}...</p>
                <p><strong>画面サイズ:</strong> ${window.screen.width} x ${window.screen.height}</p>
                <p><strong>ビューポート:</strong> ${window.innerWidth} x ${window.innerHeight}</p>
                <p><em>※ これはデモ用のモックデータです</em></p>
            `;
        }
        
        elements.deviceInfo.innerHTML = deviceInfo;
        showMessage('デバイス情報を取得しました', 'success');
    } catch (error) {
        console.error('Get device info failed:', error);
        showMessage('デバイス情報の取得に失敗しました', 'error');
    }
};

// 位置情報取得
const getLocation = () => {
    try {
        showLoading();
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude, accuracy } = position.coords;
                    elements.locationInfo.innerHTML = `
                        <h4>位置情報:</h4>
                        <p><strong>緯度:</strong> ${latitude.toFixed(6)}</p>
                        <p><strong>経度:</strong> ${longitude.toFixed(6)}</p>
                        <p><strong>精度:</strong> ${accuracy.toFixed(0)}m</p>
                        <p><strong>取得時刻:</strong> ${new Date().toLocaleString()}</p>
                    `;
                    showMessage('位置情報を取得しました', 'success');
                    hideLoading();
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    elements.locationInfo.innerHTML = `
                        <h4>位置情報取得エラー:</h4>
                        <p>${error.message}</p>
                    `;
                    showMessage('位置情報の取得に失敗しました', 'error');
                    hideLoading();
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        } else {
            elements.locationInfo.innerHTML = `
                <h4>位置情報:</h4>
                <p>このブラウザでは位置情報がサポートされていません</p>
            `;
            showMessage('位置情報がサポートされていません', 'error');
            hideLoading();
        }
    } catch (error) {
        console.error('Get location failed:', error);
        showMessage('位置情報の取得に失敗しました', 'error');
        hideLoading();
    }
};

// 外部ブラウザで開く
const openExternal = () => {
    const url = elements.externalUrl.value.trim();
    if (!url) {
        showMessage('URLを入力してください', 'error');
        return;
    }
    
    try {
        if (typeof liff !== 'undefined' && liffInitialized && liff.openWindow) {
            liff.openWindow({
                url: url,
                external: true
            });
            showMessage('外部ブラウザでURLを開きました', 'success');
        } else {
            // モック対応
            window.open(url, '_blank');
            showMessage(`モック: 外部ブラウザで ${url} を開きました`, 'success');
        }
    } catch (error) {
        console.error('Open external failed:', error);
        showMessage('外部ブラウザでの表示に失敗しました', 'error');
    }
};

// クリップボードにコピー
const copyToClipboard = async () => {
    const text = elements.clipboardText.value.trim();
    if (!text) {
        showMessage('コピーするテキストを入力してください', 'error');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(text);
        showMessage('クリップボードにコピーしました', 'success');
        elements.clipboardText.value = '';
    } catch (error) {
        console.error('Copy to clipboard failed:', error);
        showMessage('クリップボードへのコピーに失敗しました', 'error');
    }
};

// ウィンドウを閉じる
const closeWindow = () => {
    try {
        if (typeof liff !== 'undefined' && liffInitialized && liff.closeWindow) {
            liff.closeWindow();
        } else {
            // モック対応
            if (confirm('ウィンドウを閉じますか？')) {
                window.close();
            }
        }
        showMessage('ウィンドウを閉じました', 'success');
    } catch (error) {
        console.error('Close window failed:', error);
        showMessage('ウィンドウを閉じることができませんでした', 'error');
    }
};

// イベントリスナーの設定
const setupEventListeners = () => {
    elements.loginBtn.addEventListener('click', login);
    elements.logoutBtn.addEventListener('click', logout);
    elements.scanQrBtn.addEventListener('click', scanQrCode);
    elements.sendMessageBtn.addEventListener('click', sendMessage);
    elements.shareBtn.addEventListener('click', shareContent);
    elements.getDeviceInfoBtn.addEventListener('click', getDeviceInfo);
    elements.getLocationBtn.addEventListener('click', getLocation);
    elements.openExternalBtn.addEventListener('click', openExternal);
    elements.copyToClipboardBtn.addEventListener('click', copyToClipboard);
    elements.closeWindowBtn.addEventListener('click', closeWindow);
    
    // Enterキーでの送信対応
    elements.messageText.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
};

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    initializeLiff();
    
    // 初期メッセージ
    showMessage('LINEミニアプリデモへようこそ！', 'info');
});
