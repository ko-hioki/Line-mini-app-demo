// LIFF IDを環境変数から取得
const LIFF_ID = window.ENV?.LIFF_ID || 'YOUR_LIFF_ID';

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
        
        // 環境情報をログ出力
        console.log('🔍 LIFF初期化開始');
        console.log('LIFF_ID:', LIFF_ID);
        console.log('User Agent:', navigator.userAgent);
        console.log('URL:', window.location.href);
        
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
        
        console.log('🚀 LIFF SDKが利用可能です。初期化中...');
        
        await liff.init({ liffId: LIFF_ID });
        liffInitialized = true;
        
        console.log('✅ LIFF初期化成功');
        console.log('LIFF OS:', liff.getOS());
        console.log('LIFF Language:', liff.getLanguage());
        console.log('LIFF Version:', liff.getVersion());
        console.log('Is in client:', liff.isInClient());
        console.log('Is logged in:', liff.isLoggedIn());
        
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
        console.error('❌ LIFF initialization failed:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            code: error.code || 'N/A',
            stack: error.stack
        });
        
        // エラーの詳細を画面に表示
        const errorMessage = `LIFF初期化エラー: ${error.message} (コード: ${error.code || 'N/A'})`;
        showMessage(errorMessage, 'error');
        
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
        // LIFF環境でscanCodeV2が利用可能かチェック
        if (typeof liff !== 'undefined' && liffInitialized && liff.scanCodeV2) {
            console.log('🔍 Starting LINE QR scanner...');
            showLoading();
            
            // scanCodeV2を使用してLINEの実際のQRコードリーダーを起動
            const result = await liff.scanCodeV2();
            
            console.log('✅ QR scan result:', result);
            
            // 長いURLや文字列の表示を最適化
            const displayValue = formatQrValue(result.value);
            elements.qrResult.innerHTML = `
                <h4>QRコード読み取り結果:</h4>
                <p><strong>値:</strong></p>
                <div class="qr-value">${displayValue}</div>
            `;
            showMessage('QRコードを読み取りました', 'success');
            
        } else if (typeof liff !== 'undefined' && liffInitialized && liff.scanCode) {
            // フォールバック: 古いscanCodeメソッド
            console.log('🔍 Using fallback scanCode...');
            showLoading();
            const result = await liff.scanCode();
            
            const displayValue = formatQrValue(result.value);
            elements.qrResult.innerHTML = `
                <h4>QRコード読み取り結果:</h4>
                <p><strong>値:</strong></p>
                <div class="qr-value">${displayValue}</div>
            `;
            showMessage('QRコードを読み取りました', 'success');
            
        } else {
            // LIFF環境外またはQRスキャン機能が利用できない場合
            console.log('⚠️ QR scan not available - showing mock data');
            const mockQrData = `https://example.com/demo?id=${Date.now()}`;
            const displayValue = formatQrValue(mockQrData);
            elements.qrResult.innerHTML = `
                <h4>QRコード読み取り結果 (モック):</h4>
                <p><strong>値:</strong></p>
                <div class="qr-value">${displayValue}</div>
                <p><em>※ LINE内ブラウザで実行すると実際のQRスキャナーが起動します</em></p>
            `;
            showMessage('⚠️ QRスキャン機能を使用するにはLINE内ブラウザで開いてください', 'warning');
        }
    } catch (error) {
        console.error('❌ QR scan failed:', error);
        
        // エラーの詳細を表示
        let errorMessage = 'QRコード読み取りに失敗しました';
        if (error.code) {
            switch (error.code) {
                case 'PERMISSION_DENIED':
                    errorMessage = 'カメラの使用許可が必要です';
                    break;
                case 'CAMERA_NOT_AVAILABLE':
                    errorMessage = 'カメラが利用できません';
                    break;
                case 'USER_CANCELLED':
                    errorMessage = 'QRスキャンがキャンセルされました';
                    break;
                default:
                    errorMessage = `エラー: ${error.code}`;
            }
        }
        
        elements.qrResult.innerHTML = `
            <h4>エラー:</h4>
            <p>${errorMessage}</p>
            <p><small>詳細: ${error.message || 'Unknown error'}</small></p>
        `;
        showMessage(errorMessage, 'error');
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
        console.log('💬 Attempting to send message...');
        console.log('LIFF initialized:', liffInitialized);
        console.log('LIFF available:', typeof liff !== 'undefined');
        console.log('sendMessages available:', typeof liff !== 'undefined' && typeof liff.sendMessages === 'function');
        
        if (typeof liff !== 'undefined' && liffInitialized && liff.sendMessages) {
            // LIFFの状態を確認
            console.log('LIFF isLoggedIn:', liff.isLoggedIn());
            console.log('LIFF isInClient:', liff.isInClient());
            
            showLoading();
            
            const messageObject = {
                type: 'text',
                text: message
            };
            
            console.log('Sending message object:', messageObject);
            
            await liff.sendMessages([messageObject]);
            
            console.log('✅ Message sent successfully');
            showMessage('メッセージを送信しました', 'success');
            
        } else {
            // LIFF環境でない場合の詳細ログ
            let reason = 'Unknown reason';
            if (typeof liff === 'undefined') {
                reason = 'LIFF SDK not loaded';
            } else if (!liffInitialized) {
                reason = 'LIFF not initialized';
            } else if (!liff.sendMessages) {
                reason = 'sendMessages method not available';
            }
            
            console.log('⚠️ Message sending not available:', reason);
            showMessage(`モック送信: "${message}" (理由: ${reason})`, 'success');
        }
        
        elements.messageText.value = '';
        
    } catch (error) {
        console.error('❌ Send message failed:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        
        // エラーの詳細分析
        let errorMessage = 'メッセージ送信に失敗しました';
        
        if (error.code) {
            switch (error.code) {
                case 'INVALID_ARGUMENT':
                    errorMessage = 'メッセージの形式が無効です';
                    break;
                case 'FORBIDDEN':
                    errorMessage = 'メッセージ送信の権限がありません';
                    break;
                case 'INTERNAL_ERROR':
                    errorMessage = 'LINE内部エラーが発生しました';
                    break;
                case 'NOT_LOGGED_IN':
                    errorMessage = 'LINEにログインしてください';
                    break;
                default:
                    errorMessage = `エラー (${error.code}): ${error.message}`;
            }
        }
        
        showMessage(errorMessage, 'error');
    } finally {
        hideLoading();
    }
};

// メッセージ送信の診断情報を表示する関数
const diagnoseSendMessage = () => {
    console.log('📋 メッセージ送信診断情報:');
    
    if (typeof liff === 'undefined') {
        console.log('❌ LIFF SDK が読み込まれていません');
        return;
    }
    
    if (!liffInitialized) {
        console.log('❌ LIFF が初期化されていません');
        return;
    }
    
    console.log('✅ LIFF SDK:', 'OK');
    console.log('✅ LIFF初期化:', 'OK');
    console.log('📱 LINE環境:', liff.isInClient() ? 'LINE内ブラウザ' : '通常ブラウザ');
    console.log('🔐 ログイン状態:', liff.isLoggedIn() ? 'ログイン済み' : '未ログイン');
    console.log('💬 sendMessages利用可能:', typeof liff.sendMessages === 'function' ? 'YES' : 'NO');
    
    if (liff.isLoggedIn()) {
        console.log('🎫 アクセストークン:', liff.getAccessToken() ? '取得済み' : '未取得');
    }
    
    // メッセージ送信に必要な条件をチェック
    const requirements = [
        { name: 'LIFF SDK', check: typeof liff !== 'undefined' },
        { name: 'LIFF初期化', check: liffInitialized },
        { name: 'sendMessages機能', check: typeof liff.sendMessages === 'function' },
        { name: 'ログイン状態', check: liff.isLoggedIn() }
    ];
    
    console.log('📝 メッセージ送信要件チェック:');
    requirements.forEach(req => {
        console.log(`${req.check ? '✅' : '❌'} ${req.name}: ${req.check ? 'OK' : 'NG'}`);
    });
    
    const allRequirementsMet = requirements.every(req => req.check);
    console.log(`🚀 メッセージ送信可能: ${allRequirementsMet ? 'YES' : 'NO'}`);
    
    if (!allRequirementsMet) {
        console.log('💡 解決方法:');
        if (!liff.isLoggedIn()) {
            console.log('   - LINEログインボタンを押してログインしてください');
        }
        if (!liff.isInClient()) {
            console.log('   - LINE内ブラウザで開いてください');
        }
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

// QRコード値の表示を最適化する関数
const formatQrValue = (value) => {
    if (!value) return 'N/A';
    
    // HTMLエスケープ
    const escapedValue = value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    
    // URLの場合、リンクとして表示
    if (escapedValue.startsWith('http://') || escapedValue.startsWith('https://')) {
        // 長いURLを短縮表示
        const displayUrl = escapedValue.length > 50 
            ? escapedValue.substring(0, 47) + '...' 
            : escapedValue;
        
        return `<a href="${escapedValue}" target="_blank" rel="noopener noreferrer" style="word-break: break-all; color: #06C755; text-decoration: underline;">${displayUrl}</a>`;
    }
    
    // 長いテキストの場合、改行を追加
    if (escapedValue.length > 30) {
        return `<span style="word-break: break-all; display: block; line-height: 1.4;">${escapedValue}</span>`;
    }
    
    return `<span style="word-break: break-all;">${escapedValue}</span>`;
};

// イベントリスナーの設定
const setupEventListeners = () => {
    elements.loginBtn.addEventListener('click', login);
    elements.logoutBtn.addEventListener('click', logout);
    elements.scanQrBtn.addEventListener('click', scanQrCode);
    elements.sendMessageBtn.addEventListener('click', () => {
        diagnoseSendMessage(); // 診断情報をコンソールに出力
        sendMessage();
    });
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
