/**
 * モーダルウィンドウ機能
 * - 複数のモーダルに対応
 * - アニメーションによるスムーズな表示/非表示
 * - キーボードアクセシビリティ対応
 */

class ModalManager {
  constructor() {
    this.activeModal = null;
    this.modals = {};
    this.triggers = document.querySelectorAll('[data-modal-trigger]');
    
    this.init();
  }
  
  init() {
    // トリガーにイベントリスナーを設定
    this.triggers.forEach(trigger => {
      const modalId = trigger.dataset.modalTrigger;
      
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal(modalId);
      });
    });
    
    // キーボードイベント（ESCキーでモーダル閉じる）
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.closeModal(this.activeModal);
      }
    });
    
    // 初期モーダルの生成
    this.createModals();
  }
  
  // モーダルコンテナの生成
  createModals() {
    this.triggers.forEach(trigger => {
      const modalId = trigger.dataset.modalTrigger;
      const modalContent = document.querySelector(`#${modalId}-content`);
      
      if (!modalContent) return;
      
      // モーダルが存在しない場合のみ作成
      if (!this.modals[modalId]) {
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        modalContainer.id = modalId;
        
        const modalDiv = document.createElement('div');
        modalDiv.className = 'modal';
        
        // モーダルのテーマがある場合は追加
        if (trigger.dataset.modalTheme) {
          modalDiv.classList.add(`modal-${trigger.dataset.modalTheme}`);
        }
        
        // モーダルのサイズがある場合は追加
        if (trigger.dataset.modalSize) {
          modalDiv.classList.add(`modal-${trigger.dataset.modalSize}`);
        }
        
        // 閉じるボタン
        const closeBtn = document.createElement('div');
        closeBtn.className = 'modal-close';
        closeBtn.setAttribute('aria-label', '閉じる');
        closeBtn.setAttribute('role', 'button');
        closeBtn.setAttribute('tabindex', '0');
        
        // コンテンツを複製
        const content = modalContent.cloneNode(true);
        content.classList.add('modal-content');
        content.style.display = 'block';
        
        // 要素を組み立て
        modalDiv.appendChild(closeBtn);
        modalDiv.appendChild(content);
        modalContainer.appendChild(modalDiv);
        document.body.appendChild(modalContainer);
        
        // 閉じるボタンのイベントリスナー
        closeBtn.addEventListener('click', () => this.closeModal(modalId));
        
        // モーダル外クリックで閉じる
        modalContainer.addEventListener('click', (e) => {
          if (e.target === modalContainer) {
            this.closeModal(modalId);
          }
        });
        
        // キーボードアクセシビリティ
        closeBtn.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.closeModal(modalId);
          }
        });
        
        // モーダルを保存
        this.modals[modalId] = modalContainer;
      }
    });
  }
  
  // モーダルを開く
  openModal(modalId) {
    const modal = this.modals[modalId];
    if (!modal) return;
    
    // 他のモーダルが開いていれば閉じる
    if (this.activeModal && this.activeModal !== modalId) {
      this.closeModal(this.activeModal);
    }
    
    // スクロール防止
    document.body.style.overflow = 'hidden';
    
    // モーダルを表示
    modal.classList.add('show');
    
    // フォーカスをモーダル内の最初のフォーカス可能な要素に移動
    setTimeout(() => {
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length) {
        focusableElements[0].focus();
      }
    }, 100);
    
    this.activeModal = modalId;
    
    // カスタムイベント発火
    const event = new CustomEvent('modal:open', { detail: { modalId } });
    document.dispatchEvent(event);
  }
  
  // モーダルを閉じる
  closeModal(modalId) {
    const modal = this.modals[modalId];
    if (!modal) return;
    
    // モーダルを非表示
    modal.classList.remove('show');
    
    // スクロール復帰
    document.body.style.overflow = '';
    
    if (this.activeModal === modalId) {
      this.activeModal = null;
    }
    
    // カスタムイベント発火
    const event = new CustomEvent('modal:close', { detail: { modalId } });
    document.dispatchEvent(event);
  }
  
  // 動的にモーダルを作成するメソッド
  createDynamicModal(options = {}) {
    const {
      id = `dynamic-modal-${Date.now()}`,
      title = '',
      content = '',
      size = '',
      theme = '',
      buttons = []
    } = options;
    
    // モーダルが既に存在する場合は削除
    if (this.modals[id]) {
      document.body.removeChild(this.modals[id]);
      delete this.modals[id];
    }
    
    // モーダルコンテナ作成
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.id = id;
    
    // モーダル作成
    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal';
    
    if (size) modalDiv.classList.add(`modal-${size}`);
    if (theme) modalDiv.classList.add(`modal-${theme}`);
    
    // 閉じるボタン
    const closeBtn = document.createElement('div');
    closeBtn.className = 'modal-close';
    closeBtn.setAttribute('aria-label', '閉じる');
    
    // コンテンツ作成
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // ヘッダー
    if (title) {
      const header = document.createElement('div');
      header.className = 'modal-header';
      
      const titleElement = document.createElement('h3');
      titleElement.className = 'modal-title';
      titleElement.textContent = title;
      
      header.appendChild(titleElement);
      modalContent.appendChild(header);
    }
    
    // 本文
    if (content) {
      const body = document.createElement('div');
      body.className = 'modal-body';
      
      if (typeof content === 'string') {
        body.innerHTML = content;
      } else if (content instanceof Node) {
        body.appendChild(content);
      }
      
      modalContent.appendChild(body);
    }
    
    // フッターとボタン
    if (buttons.length > 0) {
      const footer = document.createElement('div');
      footer.className = 'modal-footer';
      
      buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = `modal-btn ${btn.class || 'modal-btn-secondary'}`;
        button.textContent = btn.text || 'ボタン';
        
        if (btn.close) {
          button.addEventListener('click', () => this.closeModal(id));
        }
        
        if (typeof btn.callback === 'function') {
          button.addEventListener('click', btn.callback);
        }
        
        footer.appendChild(button);
      });
      
      modalContent.appendChild(footer);
    }
    
    // 要素を組み立て
    modalDiv.appendChild(closeBtn);
    modalDiv.appendChild(modalContent);
    modalContainer.appendChild(modalDiv);
    document.body.appendChild(modalContainer);
    
    // イベントリスナー設定
    closeBtn.addEventListener('click', () => this.closeModal(id));
    modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
        this.closeModal(id);
      }
    });
    
    // モーダルを保存
    this.modals[id] = modalContainer;
    
    return id;
  }
  
  // すべてのモーダルを閉じる
  closeAllModals() {
    Object.keys(this.modals).forEach(id => {
      this.closeModal(id);
    });
  }
}

// DOM読み込み完了時にモーダルマネージャーを初期化
document.addEventListener('DOMContentLoaded', () => {
  window.modalManager = new ModalManager();
  
  // グローバルヘルパー関数
  window.openModal = (id) => {
    if (window.modalManager) {
      window.modalManager.openModal(id);
    }
  };
  
  window.closeModal = (id) => {
    if (window.modalManager) {
      window.modalManager.closeModal(id);
    }
  };
  
  window.createModal = (options) => {
    if (window.modalManager) {
      return window.modalManager.createDynamicModal(options);
    }
    return null;
  };
}); 