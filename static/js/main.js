// ===========================================
// 1. APPLICATION STATE & INITIALIZATION
// ===========================================

// Application state
const appState = {
    initialized: false,
    history: [],
    api_state: null,
    grade: "มัธยมศึกษาปีที่ 1 (Grade 7)",
    topic: "",
    temperature: 0.6,
    maxTokens: 1800,
    currentImageData: null,
    eventSource: null,
    availableBots: {},
    availableCurriculum: {},
    availableScientists: {},
    selectedBot: "plama", 
    selectedScientist: "none", 
    userMode: "student",
    availableUserModes: {},
    typingTimeout: null,
    lastContentChange: Date.now(), 
    manualScrolled: false, 
    scientistDetailsCache: {},
    calculatorInstance: null,
    calculatorVisible: false,
    currentExpression: null,
    expressionHistory: [],
    inputMode: 'text',
    geometryInstance: null,
    geometryVisible: false,
    calculator3dInstance: null,
    calculator3dVisible: false,
    current3dExpression: null,
    expression3dHistory: [],
    mathCanvasInstance: null,
    mathCanvasVisible: false,
    lastDerivation: null,
    tilesInstance: null,
    tilesVisible: false,
    collaborationMode: "single",
    collaborationPair: "none",
    availableCollaborationModes: {},
    availableCollaborationPairs: {},
};

// Application initialization
async function initializeApp() {
    try {
        console.log('Starting application initialization...');

        // Initialize DOM elements
        initializeElements();

        updateConnectionStatus('connecting', 'Starting application...');

        // Initialize MathField if it exists
        if (elements.mathField) {
            initializeMathField();
        }

        // Setup event listeners
        setupEventListeners();

        // Set up resize observer for more reliable content change detection
        setupContentObservers();

        // Fetch chatbots (initially all)
        await fetchChatbots('all');

        // Fetch curriculum
        await fetchCurriculum();

        // Fetch scientists
        await fetchScientists();

        // Fetch user modes
        await fetchUserModes();

        // Fetch collaboration data
        await fetchCollaborationData();

        // Add CSS for mathematician styling
        const style = document.createElement('style');
        style.textContent = `
            /* Mathematician Styles */
            .bot-message.euclid-style .message-content {
                border-left: 4px solid #3D85C6;
                background-color: rgba(61, 133, 198, 0.05);
            }
            
            .bot-message.euclid-style .message-avatar {
                background: linear-gradient(135deg, #3D85C6, #0B5394);
            }
            
            .bot-message.pythagoras-style .message-content {
                border-left: 4px solid #6AA84F;
                background-color: rgba(106, 168, 79, 0.05);
            }
            
            .bot-message.pythagoras-style .message-avatar {
                background: linear-gradient(135deg, #6AA84F, #38761D);
            }
            
            .bot-message.leibniz-style .message-content {
                border-left: 4px solid #8E7CC3;
                background-color: rgba(142, 124, 195, 0.05);
            }
            
            .bot-message.leibniz-style .message-avatar {
                background: linear-gradient(135deg, #8E7CC3, #674EA7);
            }
            
            .bot-message.gauss-style .message-content {
                border-left: 4px solid #F1C232;
                background-color: rgba(241, 194, 50, 0.05);
            }
            
            .bot-message.gauss-style .message-avatar {
                background: linear-gradient(135deg, #F1C232, #BF9000);
            }
            
            .bot-message.ramanujan-style .message-content {
                border-left: 4px solid #E06666;
                background-color: rgba(224, 102, 102, 0.05);
            }
            
            .bot-message.ramanujan-style .message-avatar {
                background: linear-gradient(135deg, #E06666, #990000);
            }
            
            .bot-message.newton-style .message-content {
                border-left: 4px solid #76A5AF;
                background-color: rgba(118, 165, 175, 0.05);
            }
            
            .bot-message.newton-style .message-avatar {
                background: linear-gradient(135deg, #76A5AF, #45818E);
            }
            
            .bot-message.hypatia-style .message-content {
                border-left: 4px solid #C27BA0;
                background-color: rgba(194, 123, 160, 0.05);
            }
            
            .bot-message.hypatia-style .message-avatar {
                background: linear-gradient(135deg, #C27BA0, #A64D79);
            }

            .bot-message.archimedes-style .message-content {
                border-left: 4px solid #E4A33B;
                background-color: rgba(228, 163, 59, 0.05);
            }
            
            .bot-message.archimedes-style .message-avatar {
                background: linear-gradient(135deg, #E4A33B, #B3802E);
            }
            
            .bot-message.euler-style .message-content {
                border-left: 4px solid #4285F4;
                background-color: rgba(66, 133, 244, 0.05);
            }
            
            .bot-message.euler-style .message-avatar {
                background: linear-gradient(135deg, #4285F4, #0F64DC);
            }
            
            .bot-message.fibonacci-style .message-content {
                border-left: 4px solid #9C27B0;
                background-color: rgba(156, 39, 176, 0.05);
            }
            
            .bot-message.fibonacci-style .message-avatar {
                background: linear-gradient(135deg, #9C27B0, #7B1FA2);
            }
            
            .bot-message.einstein-style .message-content {
                border-left: 4px solid #4CAF50;
                background-color: rgba(76, 175, 80, 0.05);
            }
            
            .bot-message.einstein-style .message-avatar {
                background: linear-gradient(135deg, #4CAF50, #388E3C);
            }
            
            .bot-message.turing-style .message-content {
                border-left: 4px solid #03A9F4;
                background-color: rgba(3, 169, 244, 0.05);
            }
            
            .bot-message.turing-style .message-avatar {
                background: linear-gradient(135deg, #03A9F4, #0288D1);
            }
            
            .bot-message.lovelace-style .message-content {
                border-left: 4px solid #FF5722;
                background-color: rgba(255, 87, 34, 0.05);
            }
            
            .bot-message.lovelace-style .message-avatar {
                background: linear-gradient(135deg, #FF5722, #E64A19);
            }
            
            .bot-message.napier-style .message-content {
                border-left: 4px solid #607D8B;
                background-color: rgba(96, 125, 139, 0.05);
            }
            
            .bot-message.napier-style .message-avatar {
                background: linear-gradient(135deg, #607D8B, #455A64);
            }
            
            .bot-message.boole-style .message-content {
                border-left: 4px solid #795548;
                background-color: rgba(121, 85, 72, 0.05);
            }
            
            .bot-message.boole-style .message-avatar {
                background: linear-gradient(135deg, #795548, #5D4037);
            }
            
            .scientist-badge {
                display: inline-block;
                padding: 0.3rem 0.5rem;
                border-radius: 0.5rem;
                margin-top: 0.5rem;
                font-size: 0.75rem;
                font-weight: 500;
                background-color: rgba(46, 134, 171, 0.1);
                color: var(--primary-color);
            }
            
            .scientist-thinking {
                font-style: italic;
                color: #555;
            }

            /* Collaboration Mode Styles */
            .collaboration-mode-card {
                border: 2px solid #e9ecef;
                border-radius: 0.5rem;
                padding: 1rem;
                margin-bottom: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                background: white;
            }
            
            .collaboration-mode-card:hover {
                border-color: #007bff;
                box-shadow: 0 2px 8px rgba(0,123,255,0.15);
                transform: translateY(-1px);
            }
            
            .collaboration-mode-card.selected {
                border-color: #007bff;
                background-color: rgba(0,123,255,0.05);
                box-shadow: 0 2px 8px rgba(0,123,255,0.15);
            }
            
            .collaboration-mode-card-header {
                display: flex;
                align-items: center;
                margin-bottom: 0.5rem;
            }
            
            .collaboration-mode-icon {
                font-size: 1.5rem;
                margin-right: 0.75rem;
                width: 2rem;
                text-align: center;
            }
            
            .collaboration-mode-name {
                margin: 0;
                font-size: 1rem;
                font-weight: 600;
                color: #2c3e50;
            }
            
            .collaboration-mode-description {
                margin: 0;
                font-size: 0.9rem;
                color: #6c757d;
                line-height: 1.4;
            }
            
            .collaboration-pair-card {
                border: 2px solid #e9ecef;
                border-radius: 0.5rem;
                padding: 0.75rem;
                margin-bottom: 0.75rem;
                cursor: pointer;
                transition: all 0.3s ease;
                background: white;
            }
            
            .collaboration-pair-card:hover {
                border-color: #28a745;
                box-shadow: 0 2px 6px rgba(40,167,69,0.15);
                transform: translateY(-1px);
            }
            
            .collaboration-pair-card.selected {
                border-color: #28a745;
                background-color: rgba(40,167,69,0.05);
                box-shadow: 0 2px 6px rgba(40,167,69,0.15);
            }
            
            .collaboration-pair-card-header {
                display: flex;
                align-items: center;
                margin-bottom: 0.5rem;
            }
            
            .collaboration-pair-icons {
                font-size: 1.2rem;
                margin-right: 0.5rem;
                min-width: 3rem;
                text-align: center;
            }
            
            .collaboration-pair-name {
                margin: 0;
                font-size: 0.9rem;
                font-weight: 600;
                color: #2c3e50;
            }
            
            .collaboration-pair-description {
                margin: 0 0 0.25rem 0;
                font-size: 0.8rem;
                color: #6c757d;
                line-height: 1.3;
            }
            
            .collaboration-pair-mathematicians {
                font-size: 0.75rem;
                color: #495057;
            }
            
            .collaboration-mode-features {
                margin-top: 1rem;
                font-size: 0.85rem;
            }
            
            .collaboration-mode-features h6 {
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
                color: #007bff;
            }
        `;
        document.head.appendChild(style);

        // Initialize window resize handler
        window.addEventListener('resize', function () {
            // Update header height variable
            const headerHeight = document.querySelector('.app-header')?.offsetHeight || 0;
            if (headerHeight > 0) {
                document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
            }

            // Check if at bottom before resize
            if (appState.initialized && elements.chatMessages) {
                const chatMessages = elements.chatMessages;
                const wasAtBottom = chatMessages.scrollHeight - chatMessages.clientHeight - chatMessages.scrollTop < 150;

                if (wasAtBottom) {
                    enhancedScrollToBottom(true);
                }
            }

            // Resize calculator if visible
            if (appState.calculatorInstance && appState.inputMode === 'graph') {
                appState.calculatorInstance.resize();
            }

            // Note: For Geometry, no need to call resize manually due to autosize: true
        });

        // Network status events
        window.addEventListener('online', () => {
            updateConnectionStatus('online', 'Connected');
            showToast('You are back online', 'success');
        });

        window.addEventListener('offline', () => {
            updateConnectionStatus('offline', 'Disconnected');
            showToast('You are offline. Check your internet connection', 'error');
        });

        updateConnectionStatus('online', 'Ready');
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
        updateConnectionStatus('offline', 'Initialization error');
        showToast(`Error initializing application: ${error.message}`, 'error');
    }
}

// Start the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// ===========================================
// 2. DOM ELEMENT MANAGEMENT
// ===========================================

// DOM Elements object for storing references to DOM elements
const elements = {};

// Initialize the DOM elements when document is loaded
function initializeElements() {
    try {
        // Main elements
        elements.connectionStatus = document.getElementById('connectionStatus');
        elements.statusText = document.getElementById('statusText');
        elements.messageCount = document.getElementById('messageCount');
        elements.mobileMsgCount = document.getElementById('mobileMsgCount');

        // Chat components
        elements.welcomeScreen = document.getElementById('welcomeScreen');
        elements.chatContainer = document.getElementById('chatContainer');
        elements.chatMessages = document.getElementById('chatMessages');
        elements.chatInputContainer = document.getElementById('chatInputContainer');
        elements.chatForm = document.getElementById('chatForm');
        elements.chatArea = document.getElementById('chatArea');

        // Input modes
        elements.textModeBtn = document.getElementById('textModeBtn');
        elements.mathModeBtn = document.getElementById('mathModeBtn');
        elements.graphModeBtn = document.getElementById('graphModeBtn');
        elements.geometryModeBtn = document.getElementById('geometryModeBtn');
        elements.mathCanvasBtn = document.getElementById('mathCanvasBtn');
        elements.tilesModeBtn = document.getElementById('tilesModeBtn'); // New tiles mode button

        elements.textInputGroup = document.getElementById('textInputGroup');
        elements.mathInputGroup = document.getElementById('mathInputGroup');
        elements.graphInputGroup = document.getElementById('graphInputGroup');
        elements.geometryInputGroup = document.getElementById('geometryInputGroup');
        elements.mathCanvasInputGroup = document.getElementById('mathCanvasInputGroup');
        elements.tilesInputGroup = document.getElementById('tilesInputGroup'); // New tiles input group

        // Text input elements
        elements.messageInput = document.getElementById('messageInput');
        elements.imageUpload = document.getElementById('imageUpload');
        elements.imageUploadBtn = document.getElementById('imageUploadBtn');
        elements.imagePreviewContainer = document.getElementById('imagePreviewContainer');
        elements.imagePreview = document.getElementById('imagePreview');
        elements.removeImageBtn = document.getElementById('removeImageBtn');
        elements.sendBtn = document.getElementById('sendBtn');

        // Math input elements
        elements.mathField = document.getElementById('mathField');
        elements.mathTextInput = document.getElementById('mathTextInput');
        elements.mathSendBtn = document.getElementById('mathSendBtn');

        // Calculator elements
        elements.calculatorContainer = document.getElementById('calculatorContainer');
        elements.calculator = document.getElementById('calculator');
        elements.closeCalculatorBtn = document.getElementById('closeCalculatorBtn');
        elements.shareGraphBtn = document.getElementById('shareGraphBtn');
        elements.downloadGraphBtn = document.getElementById('downloadGraphBtn');
        elements.graphTextInput = document.getElementById('graphTextInput');
        elements.graphSendBtn = document.getElementById('graphSendBtn');
        elements.resetCalculatorBtn = document.getElementById('resetCalculatorBtn');

        // Geometry elements
        elements.geometryContainer = document.getElementById('geometryContainer');
        elements.geometry = document.getElementById('geometry');
        elements.closeGeometryBtn = document.getElementById('closeGeometryBtn');
        elements.shareGeometryBtn = document.getElementById('shareGeometryBtn');
        elements.downloadGeometryBtn = document.getElementById('downloadGeometryBtn');
        elements.setBlankGeometryBtn = document.getElementById('setBlankGeometryBtn');
        elements.geometryTextInput = document.getElementById('geometryTextInput');
        elements.geometrySendBtn = document.getElementById('geometrySendBtn');

        // 3D Calculator elements
        elements.calculator3dContainer = document.getElementById('calculator3dContainer');
        elements.calculator3d = document.getElementById('calculator3d');
        elements.calculator3dBtn = document.getElementById('calculator3dBtn');
        elements.closeCalculator3dBtn = document.getElementById('closeCalculator3dBtn');
        elements.downloadGraph3dBtn = document.getElementById('downloadGraph3dBtn');
        elements.resetCalculator3dBtn = document.getElementById('resetCalculator3dBtn');
        elements.calculator3dTextInput = document.getElementById('calculator3dTextInput');
        elements.calculator3dSendBtn = document.getElementById('calculator3dSendBtn');
        elements.calculator3dInputGroup = document.getElementById('calculator3dInputGroup');

        // Math Canvas elements
        elements.mathCanvasContainer = document.getElementById('mathCanvasContainer');
        elements.mathCanvas = document.getElementById('mathCanvas');
        elements.closeMathCanvasBtn = document.getElementById('closeMathCanvasBtn');
        elements.resetMathCanvasBtn = document.getElementById('resetMathCanvasBtn');
        elements.shareMathCanvasBtn = document.getElementById('shareMathCanvasBtn');
        elements.downloadMathCanvasBtn = document.getElementById('downloadMathCanvasBtn');
        elements.mathCanvasTextInput = document.getElementById('mathCanvasTextInput');
        elements.mathCanvasSendBtn = document.getElementById('mathCanvasSendBtn');

        // Polypad Tiles elements
        elements.tilesContainer = document.getElementById('tilesContainer');
        elements.polypad = document.getElementById('polypad');
        elements.closeTilesBtn = document.getElementById('closeTilesBtn');
        elements.resetTilesBtn = document.getElementById('resetTilesBtn');
        elements.downloadTilesBtn = document.getElementById('downloadTilesBtn');
        elements.tilesTextInput = document.getElementById('tilesTextInput');
        elements.tilesSendBtn = document.getElementById('tilesSendBtn');

        // Buttons
        elements.newChatBtn = document.getElementById('newChatBtn');
        elements.startNewChatBtn = document.getElementById('startNewChatBtn');
        elements.settingsBtn = document.getElementById('settingsBtn');
        elements.undoBtn = document.getElementById('undoBtn');
        elements.retryBtn = document.getElementById('retryBtn');
        elements.clearBtn = document.getElementById('clearBtn');
        elements.saveBtn = document.getElementById('saveBtn');

        // File upload elements
        elements.uploadConversationBtn = document.getElementById('uploadConversationBtn');
        elements.conversationUpload = document.getElementById('conversationUpload');

        // Settings modal
        elements.botOptions = document.getElementById('botOptions');
        elements.botDescription = document.getElementById('botDescription');
        elements.scientistCards = document.getElementById('scientistCards');
        elements.scientistDetail = document.getElementById('scientistDetail');
        elements.gradeSelect = document.getElementById('gradeSelect');
        elements.topicSelect = document.getElementById('topicSelect');
        elements.temperatureRange = document.getElementById('temperatureRange');
        elements.temperatureValue = document.getElementById('temperatureValue');
        elements.maxTokensRange = document.getElementById('maxTokensRange');
        elements.maxTokensValue = document.getElementById('maxTokensValue');
        elements.applySettingsBtn = document.getElementById('applySettingsBtn');

        // User Mode elements
        elements.userModeSelection = document.getElementById('userModeSelection');
        elements.userModeDetail = document.getElementById('userModeDetail');

        // Collaboration Mode elements
        elements.collaborationModeSelection = document.getElementById('collaborationModeSelection');
        elements.collaborationModeDetail = document.getElementById('collaborationModeDetail');
        elements.collaborationPairGroup = document.getElementById('collaborationPairGroup');
        elements.collaborationPairSelection = document.getElementById('collaborationPairSelection');
        elements.collaborationPairDetail = document.getElementById('collaborationPairDetail');

        // Initialize Bootstrap modals if elements exist
        const settingsModalEl = document.getElementById('settingsModal');
        const imageViewerModalEl = document.getElementById('imageViewerModal');

        if (settingsModalEl && typeof bootstrap !== 'undefined') {
            elements.settingsModal = new bootstrap.Modal(settingsModalEl);
        } else {
            console.warn('Settings modal element not found or Bootstrap is not loaded');
        }

        if (imageViewerModalEl && typeof bootstrap !== 'undefined') {
            elements.imageViewerModal = new bootstrap.Modal(imageViewerModalEl);
        } else {
            console.warn('Image viewer modal element not found or Bootstrap is not loaded');
        }

        elements.modalImage = document.getElementById('modalImage');

        // Verify that critical elements exist
        if (!elements.connectionStatus || !elements.statusText || !elements.welcomeScreen) {
            throw new Error('Critical UI elements are missing. Check HTML structure.');
        }

        console.log('DOM elements initialized successfully');
    } catch (error) {
        console.error('Error initializing DOM elements:', error);
        showToast('Error initializing application: ' + error.message, 'error');
    }
}

// Set up ResizeObserver to monitor content size changes
function setupContentObservers() {
    if (!window.ResizeObserver) {
        console.warn('ResizeObserver not supported in this browser. Scroll behavior may be inconsistent.');
        return;
    }

    if (!elements.chatMessages) {
        console.warn('Chat messages container not found, skipping content observer setup');
        return;
    }

    // Create a ResizeObserver to detect when chat content size changes
    try {
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                if (entry.target === elements.chatMessages) {
                    // Check if we should scroll
                    const isNearBottom = elements.chatMessages.scrollHeight - elements.chatMessages.clientHeight - elements.chatMessages.scrollTop < 100;
                    if (isNearBottom || !appState.manualScrolled) {
                        enhancedScrollToBottom(true);
                    } else if (appState.history.length > 0) {
                        // Show scroll button if we're not at bottom
                        if (!document.getElementById('scrollBottomBtn')) {
                            addCompactScrollToBottomButton();
                        }
                    }
                }
            }
        });

        // Start observing
        resizeObserver.observe(elements.chatMessages);
        console.log('Content observer set up successfully');
    } catch (error) {
        console.error('Error setting up content observer:', error);
    }
}

// ===========================================
// 3. HELPER & UTILITY FUNCTIONS
// ===========================================

// Toast utility - optimized for better UX and space
function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        console.error('Toast container not found');
        console.log(type + ': ' + message); // Fallback to console if container not found
        return;
    }

    // Create toast element - more compact design
    const toast = document.createElement('div');
    toast.className = `toast ${type} show`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.style.minWidth = '250px';
    toast.style.maxWidth = '320px';

    // Create toast header - more compact
    const toastHeader = document.createElement('div');
    toastHeader.className = 'toast-header py-1';

    // Create icon based on toast type
    const iconClass = type === 'success' ? 'bi-check-circle' :
        type === 'warning' ? 'bi-exclamation-triangle' :
            type === 'error' ? 'bi-x-circle' : 'bi-info-circle';

    const icon = document.createElement('i');
    icon.className = `bi ${iconClass} me-2`;
    icon.style.fontSize = '0.9rem';

    // Create title based on toast type
    const title = document.createElement('strong');
    title.className = 'me-auto small';
    title.style.fontSize = '0.85rem';
    title.textContent = type === 'success' ? 'Success' :
        type === 'warning' ? 'Warning' :
            type === 'error' ? 'Error' : 'Information';

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close btn-close-sm';
    closeButton.setAttribute('data-bs-dismiss', 'toast');
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.style.fontSize = '0.75rem';

    // Append header elements
    toastHeader.appendChild(icon);
    toastHeader.appendChild(title);
    toastHeader.appendChild(closeButton);

    // Create toast body
    const toastBody = document.createElement('div');
    toastBody.className = 'toast-body py-2';
    toastBody.style.fontSize = '0.85rem';
    toastBody.textContent = message;

    // Append to toast
    toast.appendChild(toastHeader);
    toast.appendChild(toastBody);

    // Append to container
    toastContainer.appendChild(toast);

    // Auto remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode === toastContainer) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    }, duration);

    // Add click event to close button
    closeButton.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode === toastContainer) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    });
}

// Function to render KaTeX equations
function renderKaTeX() {
    if (typeof renderMathInElement !== 'function') {
        console.warn('KaTeX renderMathInElement function not available');
        return;
    }

    // Use a more targeted selector to improve performance
    const elements = document.querySelectorAll('.message-content, .card-text');

    elements.forEach(element => {
        try {
            // Check if there's unrendered LaTeX markup before processing
            if (element.innerHTML.includes('$')) {
                renderMathInElement(element, {
                    delimiters: [
                        { left: "$$", right: "$$", display: true },
                        { left: "$", right: "$", display: false },
                        { left: "\\(", right: "\\)", display: false },
                        { left: "\\[", right: "\\]", display: true }
                    ],
                    throwOnError: false,
                    errorColor: '#e74c3c',
                    strict: false,
                    trust: true,
                    macros: {
                        "\\R": "\\mathbb{R}",
                        "\\N": "\\mathbb{N}",
                        "\\Z": "\\mathbb{Z}",
                        "\\Q": "\\mathbb{Q}",
                        "\\C": "\\mathbb{C}"
                    },
                    output: "html" // Using HTML output for better rendering
                });
            }
        } catch (error) {
            console.error('KaTeX rendering error:', error);
            // Don't let KaTeX errors crash the application
        }
    });
}

// Markdown and LaTeX rendering - optimized for performance
function renderMarkdownAndLaTeX(text) {
    if (typeof marked === 'undefined') {
        console.warn('Marked library not loaded for Markdown parsing');
        return text;
    }

    // Temporarily protect LaTeX blocks from markdown processing
    const latexBlocks = [];
    let protectedText = text;

    // Extract and replace display LaTeX blocks ($$...$$)
    protectedText = protectedText.replace(/\$\$([\s\S]*?)\$\$/g, (match, latex) => {
        const id = `LATEX_BLOCK_${latexBlocks.length}`;
        latexBlocks.push({ id, latex: match, isDisplay: true });
        return id;
    });

    // Extract and replace inline LaTeX blocks ($...$)
    protectedText = protectedText.replace(/\$([^\$]*?)\$/g, (match, latex) => {
        const id = `LATEX_BLOCK_${latexBlocks.length}`;
        latexBlocks.push({ id, latex: match, isDisplay: false });
        return id;
    });

    // Parse the markdown with LaTeX blocks protected
    const html = marked.parse(protectedText);

    // Restore LaTeX blocks
    let restoredHtml = html;
    latexBlocks.forEach(block => {
        restoredHtml = restoredHtml.replace(block.id, block.latex);
    });

    // Create a container to hold the content
    const container = document.createElement('div');
    container.innerHTML = restoredHtml;

    // Add copy buttons to code blocks
    container.querySelectorAll('pre').forEach(pre => {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'code-copy-btn';
        copyBtn.innerHTML = '<i class="bi bi-clipboard"></i>';
        copyBtn.title = 'Copy to clipboard';

        copyBtn.addEventListener('click', () => {
            const codeElement = pre.querySelector('code');
            if (codeElement) {
                const code = codeElement.innerText;
                navigator.clipboard.writeText(code)
                    .then(() => {
                        copyBtn.innerHTML = '<i class="bi bi-check"></i>';
                        setTimeout(() => {
                            copyBtn.innerHTML = '<i class="bi bi-clipboard"></i>';
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Error copying code to clipboard:', err);
                        copyBtn.innerHTML = '<i class="bi bi-x"></i>';
                        setTimeout(() => {
                            copyBtn.innerHTML = '<i class="bi bi-clipboard"></i>';
                        }, 2000);
                    });
            }
        });

        pre.appendChild(copyBtn);
    });

    return container.innerHTML;
}

// Function to check viewport size and apply mobile optimizations
function applyResponsiveUI() {
    const isMobile = window.innerWidth < 768;

    // Toggle visibility of text labels based on screen size
    document.querySelectorAll('.mode-text').forEach(el => {
        el.style.display = isMobile ? 'none' : 'inline';
    });

    document.querySelectorAll('.action-text').forEach(el => {
        el.style.display = isMobile ? 'none' : 'inline';
    });

    document.querySelectorAll('.button-text').forEach(el => {
        el.style.display = isMobile ? 'none' : 'inline';
    });

    // Adjust width of buttons on mobile
    if (isMobile) {
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.add('btn-icon');
        });

        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.classList.add('btn-icon');
        });
    } else {
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('btn-icon');
        });

        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.classList.remove('btn-icon');
        });
    }
}

// Update connection status with visual indicator
function updateConnectionStatus(status, message) {
    if (!elements.connectionStatus || !elements.statusText) {
        console.warn('Connection status elements not found');
        return;
    }

    const statusDot = elements.connectionStatus.querySelector('.status-dot');
    if (!statusDot) {
        console.warn('Status dot element not found');
        return;
    }

    // Remove all classes
    statusDot.className = 'status-dot';

    // Add appropriate class
    switch (status) {
        case 'offline':
            statusDot.classList.add('offline');
            break;
        case 'connecting':
            statusDot.classList.add('connecting');
            break;
        case 'online':
            statusDot.classList.add('online');
            break;
    }

    // Update status text
    elements.statusText.textContent = message || status;
}

// Update UI button states based on chat history
function updateButtonStates() {
    const hasHistory = appState.history.length > 0;
    const hasUserMessage = appState.history.length > 0;
    const hasBotMessage = appState.history.length > 1;

    if (elements.clearBtn) elements.clearBtn.disabled = !hasHistory || !appState.initialized;
    if (elements.undoBtn) elements.undoBtn.disabled = !hasHistory || !appState.initialized;
    if (elements.retryBtn) elements.retryBtn.disabled = !hasBotMessage || !appState.initialized;
    if (elements.saveBtn) elements.saveBtn.disabled = !hasHistory || !appState.initialized;

    // Check if message count element exists
    if (elements.messageCount) {
        // Update message count
        const MAX_HISTORY = 20;
        const messagesCount = Math.floor(appState.history.length / 2);
        const remaining = MAX_HISTORY - messagesCount;
        elements.messageCount.textContent = `${messagesCount}/${MAX_HISTORY}`;

        if (elements.mobileMsgCount) {
            elements.mobileMsgCount.textContent = `${messagesCount}/${MAX_HISTORY}`;
        }

        // Disable input if max messages reached
        if (elements.messageInput) {
            elements.messageInput.disabled = remaining <= 0;
            if (elements.messageInput.disabled) {
                elements.messageInput.placeholder = "Maximum message limit reached";
            } else {
                elements.messageInput.placeholder = "Type your message or question...";
            }
        }

        if (elements.sendBtn) {
            elements.sendBtn.disabled = remaining <= 0;
        }

        if (elements.mathField) {
            if (typeof elements.mathField.disabled !== 'undefined') {
                elements.mathField.disabled = remaining <= 0;
            }
        }

        if (elements.mathSendBtn) {
            elements.mathSendBtn.disabled = remaining <= 0;
        }
    }
}

// Enhanced scroll-to-bottom function with better performance
function enhancedScrollToBottom(force = false) {
    const chatMessages = elements.chatMessages;
    if (!chatMessages) return;

    // Check if user is already near bottom (reduced threshold)
    const isNearBottom = chatMessages.scrollHeight - chatMessages.clientHeight - chatMessages.scrollTop < 100;

    // Check if content was recently changed
    const recentContentChange = (Date.now() - appState.lastContentChange) < 300;

    if (isNearBottom || force || recentContentChange) {
        // Use requestAnimationFrame to ensure we scroll after rendering
        requestAnimationFrame(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });

        // Hide scroll-to-bottom button if it exists
        const scrollBtn = document.getElementById('scrollBottomBtn');
        if (scrollBtn) scrollBtn.remove();
    } else if (!document.getElementById('scrollBottomBtn') && appState.history.length > 0) {
        // If we're not scrolling and the button doesn't exist yet, add a more compact button
        addCompactScrollToBottomButton();
    }
}

// Add a more compact scroll-to-bottom button
function addCompactScrollToBottomButton() {
    // Remove existing button if any
    const existingBtn = document.getElementById('scrollBottomBtn');
    if (existingBtn) existingBtn.remove();

    // Create new button - more compact design
    const btn = document.createElement('button');
    btn.id = 'scrollBottomBtn';
    btn.className = 'btn btn-sm btn-primary position-absolute bottom-0 end-0 m-2 d-flex align-items-center justify-content-center';
    btn.innerHTML = '<i class="bi bi-arrow-down"></i>';
    btn.style.zIndex = '100';
    btn.style.opacity = '0.8';
    btn.style.transition = 'opacity 0.3s ease';
    btn.style.borderRadius = '50%';
    btn.style.width = '36px';
    btn.style.height = '36px';
    btn.style.padding = '0';

    btn.addEventListener('click', () => {
        enhancedScrollToBottom(true);
        btn.remove();
        appState.manualScrolled = false;
    });

    // Add to chat container if it exists
    if (elements.chatContainer) {
        elements.chatContainer.appendChild(btn);
    }
}

// Optimized function for textarea auto-resize
function optimizedTextareaResize(textarea) {
    if (!textarea) return;

    // Set minimum height
    const minHeight = 38;
    // Set maximum height to limit expansion
    const maxHeight = 120;

    textarea.style.height = `${minHeight}px`;

    // Only expand if content exceeds minimum height
    if (textarea.scrollHeight > minHeight) {
        textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    }
}

// Process image on client side instead of uploading to server
async function processImageClientSide(file) {
    return new Promise((resolve, reject) => {
        try {
            // Show loading toast
            showToast('Processing image...', 'info');

            // Validate file type
            const validTypes = ['image/jpeg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                reject(new Error('Please upload only JPEG or PNG files'));
                return;
            }

            // Validate file size
            if (file.size > 20 * 1024 * 1024) { // 20MB limit
                reject(new Error('File size must not exceed 20MB'));
                return;
            }

            // Read file and convert to base64
            const reader = new FileReader();

            reader.onload = (event) => {
                const fullImage = event.target.result; // Full base64 image

                // Create thumbnail with optimized dimensions
                const img = new Image();
                img.src = fullImage;

                img.onload = () => {
                    // Create canvas for resizing the image
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Set maximum dimensions for preview image
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;

                    let width = img.width;
                    let height = img.height;

                    // Calculate scaled dimensions
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    // Set canvas size
                    canvas.width = width;
                    canvas.height = height;

                    // Draw resized image on canvas
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert canvas to base64 for thumbnail - use better compression
                    const thumbnailImage = canvas.toDataURL('image/jpeg', 0.85);

                    // Create unique ID for this image
                    const imageId = `img_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

                    // Create object to store image data
                    const imageData = {
                        id: imageId,
                        preview: thumbnailImage,
                        fileName: file.name,
                        fileType: file.type,
                        fileSize: file.size,
                        uploadTime: new Date().toISOString()
                    };

                    resolve(imageData);
                };

                img.onerror = () => {
                    reject(new Error('Could not read image'));
                };
            };

            reader.onerror = () => {
                reject(new Error('Error reading file'));
            };

            // Start reading file as base64
            reader.readAsDataURL(file);

        } catch (error) {
            reject(error);
        }
    });
}

// Function to upload image
async function uploadImage(file) {
    try {
        return await processImageClientSide(file);
    } catch (error) {
        console.error('Error processing image:', error);
        showToast(`Error: ${error.message}`, 'error');
        return null;
    }
}

// ===========================================
// 4. UI COMPONENTS & INTERACTIVE TOOLS
// ===========================================

// Initialize MathLive Field
function initializeMathField() {
    if (elements.mathField) {
        try {
            // Configure MathField
            elements.mathField.addEventListener('input', (evt) => {
                console.log('Math field content changed:', elements.mathField.value);
            });

            // Set virtual keyboard options
            elements.mathField.setOptions({
                virtualKeyboardMode: 'manual',
                virtualKeyboards: 'all',
                virtualKeyboardTheme: 'material',
                virtualKeyboardToggleGlyph: '⌨',
                virtualKeyboardVisible: false
            });
        } catch (error) {
            console.error('Error initializing MathField:', error);
            showToast('Error initializing math input: ' + error.message, 'warning');
        }
    } else {
        console.warn('MathField element not found in DOM');
    }
}

// Initialize Desmos Calculator with enhanced debugging
function initializeCalculator() {
    if (elements.calculator) {
        console.log("Initializing Desmos calculator...");
        try {
            // Check if Desmos is properly loaded
            if (typeof Desmos === 'undefined') {
                throw new Error("Desmos API not loaded");
            }

            appState.calculatorInstance = Desmos.GraphingCalculator(elements.calculator, {
                expressions: true,
                settingsMenu: true,
                zoomButtons: true,
                expressionsTopbar: true,
                border: false
            });

            // Verify calculator initialization
            if (appState.calculatorInstance) {
                console.log("Calculator initialized successfully");

                // Add example graph
                appState.calculatorInstance.setExpression({
                    id: 'welcome',
                    latex: 'y=x^2',
                    color: Desmos.Colors.BLUE
                });
            } else {
                console.error("Failed to initialize calculator - instance is undefined");
            }
        } catch (error) {
            console.error("Error initializing calculator:", error);
            showToast("Error initializing calculator: " + error.message, "error");
        }
    } else {
        console.error("Calculator element not found in DOM");
    }
}

function resetCalculator() {
    if (!appState.calculatorInstance) {
        showToast('Calculator not initialized', 'error');
        return;
    }

    try {
        // Try the best compatible option first
        if (typeof appState.calculatorInstance.removeAll === 'function') {
            appState.calculatorInstance.removeAll();
        }
        // Otherwise, fall back to individual expression removal
        else if (typeof appState.calculatorInstance.getExpressions === 'function') {
            const expressions = appState.calculatorInstance.getExpressions();
            expressions.forEach(expr => {
                if (expr.id) {
                    appState.calculatorInstance.removeExpression({ id: expr.id });
                }
            });
        }
        // As a last resort, use setBlank which resets the entire calculator state
        else {
            appState.calculatorInstance.setBlank();
        }

        // Add a default expression
        appState.calculatorInstance.setExpression({
            id: 'welcome',
            latex: 'y=x^2',
            color: Desmos.Colors.BLUE
        });

        // Reset view to default
        appState.calculatorInstance.setMathBounds({
            left: -10,
            right: 10,
            bottom: -10,
            top: 10
        });

        showToast('Calculator reset successfully', 'success');
    } catch (error) {
        console.error('Error resetting calculator:', error);
        showToast(`Error: ${error.message}`, 'error');
    }
}

// Improved function to download graph
function downloadGraph() {
    if (!appState.calculatorInstance) {
        showToast('Calculator not initialized', 'error');
        return;
    }

    try {
        showToast('Preparing download...', 'info');

        // Check if asyncScreenshot is available
        if (typeof appState.calculatorInstance.asyncScreenshot === 'function') {
            // Use optimal mode based on graph projection
            const mode = appState.calculatorInstance.isProjectionUniform ?
                appState.calculatorInstance.isProjectionUniform() ? 'contain' : 'stretch' : 'contain';

            // Use asyncScreenshot for better reliability
            appState.calculatorInstance.asyncScreenshot({
                width: 1200,
                height: 800,
                targetPixelRatio: 2,
                format: 'png',
                mode: mode,
                showLabels: true,
                showMovablePoints: false,
                preserveAxisNumbers: true
            }, function (imageDataUrl) {
                if (!imageDataUrl) {
                    showToast('Failed to capture graph', 'error');
                    return;
                }

                const link = document.createElement('a');
                link.href = imageDataUrl;
                link.download = `math_graph_${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                showToast('Graph downloaded successfully', 'success');
            });
        } else {
            // Fallback to regular screenshot
            const imageDataUrl = appState.calculatorInstance.screenshot({
                width: 1200,
                height: 800,
                targetPixelRatio: 2
            });

            const link = document.createElement('a');
            link.href = imageDataUrl;
            link.download = `math_graph_${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast('Graph downloaded successfully', 'success');
        }
    } catch (error) {
        console.error('Error downloading graph:', error);
        showToast('Could not download graph: ' + error.message, 'error');
    }
}

// Improved function to share graph as image using asyncScreenshot
function shareGraphAsImage() {
    if (!appState.calculatorInstance) {
        showToast('Calculator not initialized', 'error');
        return;
    }

    try {
        // Get text from input field
        const graphTitle = elements.graphTextInput && elements.graphTextInput.value ?
            elements.graphTextInput.value.trim() || 'My Graph' : 'My Graph';

        showToast('Processing graph...', 'info');

        // Check if asyncScreenshot is available
        if (typeof appState.calculatorInstance.asyncScreenshot === 'function') {
            // Use optimal mode based on graph projection
            const mode = appState.calculatorInstance.isProjectionUniform ?
                appState.calculatorInstance.isProjectionUniform() ? 'contain' : 'stretch' : 'contain';

            // Use asyncScreenshot for better reliability
            appState.calculatorInstance.asyncScreenshot({
                width: 800,
                height: 450,
                targetPixelRatio: 2,
                format: 'png',
                mode: mode,
                showLabels: true,
                showMovablePoints: false,
                preserveAxisNumbers: true
            }, function (imageDataUrl) {
                if (!imageDataUrl) {
                    showToast('Failed to capture graph', 'error');
                    return;
                }

                // Create message with image and custom text
                const message = {
                    type: 'image',
                    text: graphTitle,
                    preview: imageDataUrl,
                    fileName: `graph_${Date.now()}.png`
                };

                // Add to history and display
                appState.history.push(message);
                appendMessage(message, true);

                // Send to API
                sendToAPI(message);

                // Clear input field after sending
                if (elements.graphTextInput) {
                    elements.graphTextInput.value = '';
                }

                showToast('Graph shared successfully', 'success');
            });
        } else {
            // Fallback to regular screenshot if asyncScreenshot not available
            const imageDataUrl = appState.calculatorInstance.screenshot({
                width: 800,
                height: 450,
                targetPixelRatio: 2
            });

            // Create message with image and custom text
            const message = {
                type: 'image',
                text: graphTitle,
                preview: imageDataUrl,
                fileName: `graph_${Date.now()}.png`
            };

            // Add to history and display
            appState.history.push(message);
            appendMessage(message, true);

            // Send to API
            sendToAPI(message);

            // Clear input field after sending
            if (elements.graphTextInput) {
                elements.graphTextInput.value = '';
            }

            showToast('Graph shared successfully', 'success');
        }
    } catch (error) {
        console.error('Error capturing graph:', error);
        showToast('Could not capture graph: ' + error.message, 'error');
    }
}

// Add calculator-specific functions
function addExpressionToCalculator() {
    if (!elements.graphTextInput) {
        console.warn('Graph text input element not found');
        return;
    }

    const expression = elements.graphTextInput.value.trim();
    if (!expression) return;

    if (appState.calculatorInstance) {
        try {
            const id = 'expr-' + Date.now();
            appState.calculatorInstance.setExpression({
                id: id,
                latex: expression
            });
            showToast('Expression added to graph', 'success');
        } catch (error) {
            showToast('Invalid expression: ' + error.message, 'error');
        }
    }
}

// Initialize Geometry
function initializeGeometry() {
    if (elements.geometry) {
        console.log("Initializing Desmos geometry...");
        try {
            // Check if Desmos is properly loaded
            if (typeof Desmos === 'undefined' || typeof Desmos.Geometry !== 'function') {
                throw new Error("Desmos Geometry API not loaded");
            }

            appState.geometryInstance = Desmos.Geometry(elements.geometry, {
                autosize: true,
                expressions: true,
                settingsMenu: true,
                zoomButtons: true,
                expressionsTopbar: true,
                border: false,
                folders: true,
                notes: true,
                sliders: true,
                lockViewport: false
            });

            // Verify geometry initialization
            if (appState.geometryInstance) {
                console.log("Geometry initialized successfully");

                // Set default state to add a welcome message
                setTimeout(() => {
                    try {
                        // Add a default welcome state if needed
                        const defaultState = appState.geometryInstance.getState();
                        appState.geometryInstance.setDefaultState(defaultState);
                    } catch (error) {
                        console.warn("Could not set default state:", error);
                    }
                }, 1000);
            } else {
                console.error("Failed to initialize geometry - instance is undefined");
            }
        } catch (error) {
            console.error("Error initializing geometry:", error);
            showToast("Error initializing geometry: " + error.message, "error");
        }
    } else {
        console.error("Geometry element not found in DOM");
    }
}

function resetGeometry() {
    if (!appState.geometryInstance) {
        showToast('Geometry not initialized', 'error');
        return;
    }

    try {
        appState.geometryInstance.setBlank();
        showToast('Geometry reset successfully', 'success');
    } catch (error) {
        console.error('Error resetting geometry:', error);
        showToast(`Error: ${error.message}`, 'error');
    }
}

function shareGeometry() {
    if (!appState.geometryInstance) {
        showToast('Geometry not initialized', 'error');
        return;
    }

    try {
        // Get text from input field  
        const geometryTitle = elements.geometryTextInput && elements.geometryTextInput.value ?
            elements.geometryTextInput.value.trim() : '';

        if (!geometryTitle) {
            showToast('Please enter a description for your geometry', 'warning');
            return;
        }

        showToast('Processing geometry...', 'info');

        // ✅ ตรวจสอบว่ามี asyncScreenshot หรือไม่
        if (typeof appState.geometryInstance.asyncScreenshot === 'function') {
            // Use asyncScreenshot for better reliability with labels
            appState.geometryInstance.asyncScreenshot({
                width: 800,
                height: 600,
                targetPixelRatio: 2,
                format: 'png',
                showLabels: true,
                showMovablePoints: false,
                mode: 'contain'
            }, function (imageDataUrl) {
                if (!imageDataUrl) {
                    showToast('Failed to capture geometry', 'error');
                    return;
                }

                const message = {
                    type: 'image', 
                    text: geometryTitle,
                    preview: imageDataUrl,
                    fileName: `geometry_${Date.now()}.png` 
                };

                // Add to history and display
                appState.history.push(message);
                appendMessage(message, true);

                // Send to API
                sendToAPI(message);

                // Clear input field after sending
                if (elements.geometryTextInput) {
                    elements.geometryTextInput.value = '';
                }

                showToast('Geometry shared successfully', 'success');
            });
        } else {
            // Fallback to regular screenshot
            console.warn('asyncScreenshot not available for Geometry, labels will not be shown');
            const imageDataUrl = appState.geometryInstance.screenshot({
                width: 800,
                height: 600,
                targetPixelRatio: 2
            });

            if (!imageDataUrl) {
                throw new Error('Failed to capture geometry screenshot');
            }

            const message = {
                type: 'image', 
                text: geometryTitle,
                preview: imageDataUrl,
                fileName: `geometry_${Date.now()}.png` 
            };

            // Add to history and display
            appState.history.push(message);
            appendMessage(message, true);

            // Send to API
            sendToAPI(message);

            // Clear input field after sending
            if (elements.geometryTextInput) {
                elements.geometryTextInput.value = '';
            }

            showToast('Geometry shared successfully (without labels)', 'success');
        }
    } catch (error) {
        console.error('Error sharing geometry:', error);
        showToast(`Error: ${error.message}`, 'error');
    }
}

function downloadGeometry() {
    if (!appState.geometryInstance) {
        showToast('Geometry not initialized', 'error');
        return;
    }

    try {
        showToast('Preparing geometry download...', 'info');

        // ✅ ตรวจสอบว่ามี asyncScreenshot หรือไม่
        if (typeof appState.geometryInstance.asyncScreenshot === 'function') {
            // Use asyncScreenshot for higher quality and labels
            appState.geometryInstance.asyncScreenshot({
                width: 1200,
                height: 800,
                targetPixelRatio: 2,
                format: 'png',
                showLabels: true,           // 🆕 เพิ่ม showLabels
                showMovablePoints: false,   // 🆕 เพิ่มตัวเลือกนี้
                mode: 'contain'             // 🆕 เพิ่ม mode
            }, function (imageDataUrl) {
                if (!imageDataUrl) {
                    showToast('Failed to capture geometry', 'error');
                    return;
                }

                const link = document.createElement('a');
                link.href = imageDataUrl;
                link.download = `geometry_construction_${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                showToast('Geometry downloaded successfully', 'success');
            });
        } else {
            // Fallback to regular screenshot
            console.warn('asyncScreenshot not available for Geometry, labels will not be shown');
            const imageDataUrl = appState.geometryInstance.screenshot({
                width: 1200,
                height: 800,
                targetPixelRatio: 2
            });

            if (!imageDataUrl) {
                throw new Error('Failed to capture screenshot for download');
            }

            const link = document.createElement('a');
            link.href = imageDataUrl;
            link.download = `geometry_construction_${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast('Geometry downloaded successfully (without labels)', 'success');
        }
    } catch (error) {
        console.error('Error downloading geometry:', error);
        showToast('Could not download geometry: ' + error.message, 'error');
    }
}

// Initialize Graspable Math Canvas
function initializeMathCanvas() {
    if (elements.mathCanvas) {
        console.log("Initializing Graspable Math canvas...");
        try {
            if (typeof loadGM !== 'function') {
                throw new Error('Graspable Math API (loadGM) not loaded');
            }

            loadGM(function () {
                try {
                    // Create Canvas with custom settings
                    appState.mathCanvasInstance = new gmath.Canvas('#mathCanvas', {
                        use_toolbar: true,
                        undo_btn: true,
                        redo_btn: true,
                        font_size_btns: true,
                        formula_btn: false,
                        transform_btn: true,
                        reset_btn: true,
                        vertical_scroll: true,
                        btn_size: 'xs',
                        help_logo_btn: false,
                        help_btn: false,
                        display_labels: false,
                        save_btn: false,
                        load_btn: false,
                        new_sheet_btn: false,
                        scrub_btn: false,
                        formula_panel: true
                    });

                    console.log('Math Canvas initialized successfully');

                    // Add example derivation only if Canvas was initialized successfully
                    if (appState.mathCanvasInstance) {
                        addExampleDerivation();
                        showToast('Math Canvas initialized successfully', 'success');
                    }
                } catch (canvasError) {
                    console.error('Error creating Math Canvas:', canvasError);
                    showToast('Error initializing Math Canvas: ' + canvasError.message, 'error');
                }
            }, { version: 'latest' });
        } catch (error) {
            console.error("Error initializing Math Canvas:", error);
            showToast("Error initializing Math Canvas: " + error.message, "error");
        }
    } else {
        console.error("Math Canvas element not found in DOM");
    }
}

// Add example derivation
function addExampleDerivation() {
    if (!appState.mathCanvasInstance) return;

    try {
        // Remove previous derivations if any
        const elements = appState.mathCanvasInstance.model.elements();
        elements.forEach(element => {
            if (element.type === 'derivation') {
                appState.mathCanvasInstance.model.removeElement(element);
            }
        });

        // Create a new derivation with an example equation
        appState.lastDerivation = appState.mathCanvasInstance.model.createElement('derivation', {
            eq: '2x+1=3',
            pos: { x: 'center', y: 'center' },
            font_size: 50
        });

        // Add event listener to track changes
        if (appState.lastDerivation && appState.lastDerivation.events) {
            appState.lastDerivation.events.on('change', function (evt) {
                console.log('Derivation changed:', evt);
            });
        }
    } catch (error) {
        console.error('Error adding example derivation:', error);
    }
}

// Reset Math Canvas
function resetMathCanvas() {
    if (!appState.mathCanvasInstance) {
        showToast('Math Canvas not initialized', 'error');
        return;
    }

    try {
        const elements = appState.mathCanvasInstance.model.elements();
        elements.forEach(element => {
            appState.mathCanvasInstance.model.removeElement(element);
        });

        // Add new example derivation
        addExampleDerivation();

        showToast('Math Canvas reset successfully', 'success');
    } catch (error) {
        console.error('Error resetting Math Canvas:', error);
        showToast(`Error: ${error.message}`, 'error');
    }
}

// Share Math Canvas as a snapshot
function shareMathCanvas() {
    if (!appState.mathCanvasInstance) {
        showToast('Math Canvas not initialized', 'error');
        return;
    }

    try {
        // Show loading toast
        showToast('Processing math canvas...', 'info');

        // Get the description from the input field
        const description = elements.mathCanvasTextInput ?
            elements.mathCanvasTextInput.value.trim() || 'My Math Work' : 'My Math Work';

        // Use html2canvas to capture the math canvas
        const canvasElement = document.querySelector('#mathCanvas');

        if (!canvasElement) {
            throw new Error('Math canvas element not found for capture');
        }

        if (typeof html2canvas !== 'function') {
            throw new Error('html2canvas library not loaded');
        }

        html2canvas(canvasElement, {
            backgroundColor: '#ffffff',
            scale: 2, // Higher resolution
            logging: false,
            useCORS: true
        }).then(canvas => {
            // Convert canvas to data URL
            const imageDataUrl = canvas.toDataURL('image/png');

            // Create message with image and user description only
            const message = {
                type: 'image',
                text: description,
                preview: imageDataUrl,
                fileName: `math_work_${Date.now()}.png`
            };

            // Add to history and display
            appState.history.push(message);
            appendMessage(message, true);

            // Send to API
            sendToAPI(message);

            // Clear input field
            if (elements.mathCanvasTextInput) {
                elements.mathCanvasTextInput.value = '';
            }

            showToast('Math work shared successfully', 'success');
        }).catch(error => {
            console.error('Error capturing math canvas:', error);
            showToast('Error capturing math canvas: ' + error.message, 'error');
        });

    } catch (error) {
        console.error('Error sharing math canvas:', error);
        showToast(`Error: ${error.message}`, 'error');
    }
}

// Download Math Canvas as image
function downloadMathCanvas() {
    if (!appState.mathCanvasInstance) {
        showToast('Math Canvas not initialized', 'error');
        return;
    }

    try {
        showToast('Preparing download...', 'info');

        const canvasElement = document.querySelector('#mathCanvas');

        if (!canvasElement) {
            throw new Error('Math canvas element not found for download');
        }

        if (typeof html2canvas !== 'function') {
            throw new Error('html2canvas library not loaded');
        }

        html2canvas(canvasElement, {
            backgroundColor: '#ffffff',
            scale: 2, // Higher resolution
            logging: false,
            useCORS: true
        }).then(canvas => {
            // Create link for download
            const link = document.createElement('a');
            link.download = `math_work_${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast('Math canvas downloaded successfully', 'success');
        }).catch(error => {
            console.error('Error capturing math canvas for download:', error);
            showToast('Error preparing download: ' + error.message, 'error');
        });

    } catch (error) {
        console.error('Error downloading math canvas:', error);
        showToast(`Error: ${error.message}`, 'error');
    }
}

// Initialize Polypad interactive tiles
function initializePolypad() {
    if (elements.polypad) {
        console.log("Initializing Polypad...");
        try {
            if (typeof Polypad === 'undefined') {
                throw new Error("Polypad API not loaded");
            }

            // Create a new Polypad instance
            appState.tilesInstance = Polypad.create(elements.polypad, {
                sidebarTiles: true,
                sidebarSettings: true,
                toolbar: true,
                settings: true,
                initial: {
                    options: {
                        grid: 'none',
                        sidebar: 'geometry,polygons,numbers,number-cards,primes,fractions,fraction-bars,fraction-circles,algebra,balance'
                    }
                }
            });

            // Verify initialization
            if (appState.tilesInstance) {
                console.log("Polypad initialized successfully");
                console.log("Available methods:", Object.getOwnPropertyNames(appState.tilesInstance));
                showToast('Polypad interactive tiles loaded successfully', 'success');
            } else {
                console.error("Failed to initialize Polypad - instance is undefined");
            }
        } catch (error) {
            console.error("Error initializing Polypad:", error);
            showToast("Error initializing Polypad: " + error.message, "error");
        }
    } else {
        console.error("Polypad element not found in DOM");
    }
}

// Reset the Polypad by reloading the instance completely
function resetPolypad() {
    try {
        // Show loading message
        showToast('Refreshing Polypad...', 'info');

        // Get the container element
        const polypadContainer = document.getElementById('tilesContainer');
        const polypadElement = document.getElementById('polypad');

        if (!polypadElement || !polypadContainer) {
            throw new Error('Polypad elements not found');
        }

        // First hide the container to prevent visual glitches
        polypadContainer.classList.add('d-none');

        // Clear the element's contents
        polypadElement.innerHTML = '';

        // Create a placeholder while we're reloading
        const placeholder = document.createElement('div');
        placeholder.className = 'text-center py-4';
        placeholder.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Reloading Polypad...</p>
        `;
        polypadElement.appendChild(placeholder);

        // Use setTimeout to give the UI time to update
        setTimeout(() => {
            try {
                // Remove the placeholder
                polypadElement.innerHTML = '';

                // Create new Polypad instance
                if (typeof Polypad !== 'undefined') {
                    // If there's an old instance, try to clean it up
                    if (appState.tilesInstance) {
                        // Try to clean up if a method exists for that
                        try {
                            if (typeof appState.tilesInstance.destroy === 'function') {
                                appState.tilesInstance.destroy();
                            }
                        } catch (err) {
                            console.warn('Could not clean up old Polypad instance:', err);
                        }
                    }

                    // Create new instance
                    appState.tilesInstance = Polypad.create(polypadElement, {
                        sidebarTiles: true,
                        sidebarSettings: true,
                        toolbar: true,
                        settings: true,
                        initial: {
                            options: {
                                grid: 'square-grid',
                                sidebar: 'geometry,polygons,polyominoes,tangram,numbers,number-tiles,fractions'
                            }
                        }
                    });

                    // Show container again
                    polypadContainer.classList.remove('d-none');

                    showToast('Polypad reset successfully', 'success');
                } else {
                    throw new Error('Polypad API not found');
                }
            } catch (innerError) {
                console.error('Error creating new Polypad instance:', innerError);
                showToast(`Error resetting Polypad: ${innerError.message}`, 'error');

                // Still show the container even if there was an error
                polypadContainer.classList.remove('d-none');
            }
        }, 500); // Wait half a second before recreating

    } catch (error) {
        console.error('Error resetting Polypad:', error);
        showToast(`Error: ${error.message}`, 'error');
    }
}

// Share Polypad tiles workspace to chat using screen capture only
function sharePolypadTiles() {
    if (!appState.tilesInstance) {
        showToast('Polypad not initialized', 'error');
        return;
    }

    try {
        // Show loading toast
        showToast('Processing tiles workspace...', 'info');

        // Get the description from the input field
        const description = elements.tilesTextInput ?
            elements.tilesTextInput.value.trim() || 'My Polypad Work' : 'My Polypad Work';

        // Use html2canvas to capture the polypad canvas
        const polypadElement = document.querySelector('#polypad');

        if (!polypadElement) {
            throw new Error('Polypad element not found for capture');
        }

        if (typeof html2canvas !== 'function') {
            throw new Error('html2canvas library not loaded');
        }

        html2canvas(polypadElement, {
            backgroundColor: '#ffffff',
            scale: 2, // Higher resolution
            logging: false,
            useCORS: true
        }).then(canvas => {
            // Convert canvas to data URL
            const imageDataUrl = canvas.toDataURL('image/png');

            // Create message with image and text only (no state data)
            const message = {
                type: 'image', // Use standard image type instead of custom tiles type
                text: description,
                preview: imageDataUrl,
                fileName: `polypad_tiles_${Date.now()}.png`
            };

            // Add to history and display
            appState.history.push(message);
            appendMessage(message, true);

            // Send to API
            sendToAPI(message);

            // Clear input field
            if (elements.tilesTextInput) {
                elements.tilesTextInput.value = '';
            }

            showToast('Tiles workspace shared successfully', 'success');
        }).catch(error => {
            console.error('Error capturing polypad canvas:', error);
            showToast('Error capturing polypad: ' + error.message, 'error');
        });

    } catch (error) {
        console.error('Error sharing polypad tiles:', error);
        showToast(`Error: ${error.message}`, 'error');
    }
}

// Download Polypad tiles workspace as image
function downloadPolypadTiles() {
    if (!elements.polypad) {
        showToast('Polypad not initialized', 'error');
        return;
    }

    try {
        showToast('Preparing download...', 'info');

        // Use html2canvas to capture the polypad canvas
        const polypadElement = document.querySelector('#polypad');

        if (!polypadElement) {
            throw new Error('Polypad element not found for capture');
        }

        if (typeof html2canvas !== 'function') {
            throw new Error('html2canvas library not loaded');
        }

        html2canvas(polypadElement, {
            backgroundColor: '#ffffff',
            scale: 2, // Higher resolution
            logging: false,
            useCORS: true
        }).then(canvas => {
            // Create link for download
            const link = document.createElement('a');
            link.download = `polypad_tiles_${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast('Tiles workspace downloaded successfully', 'success');
        }).catch(error => {
            console.error('Error capturing polypad for download:', error);
            showToast('Error preparing download: ' + error.message, 'error');
        });

    } catch (error) {
        console.error('Error downloading polypad:', error);
        showToast(`Error: ${error.message}`, 'error');
    }
}

// Initialize Desmos 3D Calculator
function initializeCalculator3d() {
    console.log("Attempting to initialize Desmos 3D Calculator...");
    
    if (!elements.calculator3d) {
        console.error('3D Calculator element not found');
        showToast('3D Calculator element not found', 'error');
        return;
    }

    try {
        // Check if Desmos API is loaded
        if (typeof Desmos === 'undefined') {
            throw new Error('Desmos API not loaded');
        }
        
        if (typeof Desmos.Calculator3D !== 'function') {
            throw new Error('Desmos 3D Calculator API not available');
        }

        console.log("Creating Desmos 3D Calculator instance...");
        
        // Create 3D Calculator instance
        appState.calculator3dInstance = Desmos.Calculator3D(elements.calculator3d, {
            expressions: true,
            settingsMenu: true,
            zoomButtons: true,
            expressionsTopbar: true,
            border: false
        });

        // Verify initialization
        if (appState.calculator3dInstance) {
            console.log("Desmos 3D Calculator initialized successfully");
            appState.calculator3dVisible = true;
            showToast('3D Calculator initialized successfully', 'success');
        } else {
            throw new Error("Failed to create 3D Calculator instance");
        }

    } catch (error) {
        console.error('Error initializing 3D Calculator:', error);
        showToast('Error initializing 3D Calculator: ' + error.message, 'error');
        
        // Fallback: show error message in the container
        if (elements.calculator3d) {
            elements.calculator3d.innerHTML = `
                <div class="alert alert-danger m-3">
                    <h6><i class="bi bi-exclamation-triangle"></i> 3D Calculator Error</h6>
                    <p class="mb-0">Could not initialize 3D Calculator: ${error.message}</p>
                    <small class="text-muted">Please check if Desmos 3D API is properly loaded.</small>
                </div>
            `;
        }
    }
}

function resetCalculator3d() {
    if (!appState.calculator3dInstance) {
        showToast('3D Calculator not initialized', 'error');
        return;
    }

    try {
        // Reset to blank state
        appState.calculator3dInstance.setBlank();
        
        // Clear expression history
        appState.expression3dHistory = [];
        appState.current3dExpression = null;
        
        showToast('3D Calculator reset successfully', 'success');
    } catch (error) {
        console.error('Error resetting 3D Calculator:', error);
        showToast('Error resetting 3D Calculator: ' + error.message, 'error');
    }
}

function shareCalculator3d() {
    if (!appState.calculator3dInstance) {
        showToast('3D Calculator not available', 'error');
        return;
    }

    try {
        const calculator3dTitle = elements.calculator3dTextInput ? 
            elements.calculator3dTextInput.value.trim() : '';

        if (!calculator3dTitle) {
            showToast('Please enter a description for your 3D graph', 'warning');
            return;
        }

        // Get current state
        const currentState = appState.calculator3dInstance.getState();
        
        // Capture screenshot
        const imageDataUrl = appState.calculator3dInstance.screenshot({
            width: 800,
            height: 600,
            targetPixelRatio: 2
        });

        if (!imageDataUrl) {
            throw new Error('Failed to capture 3D graph screenshot');
        }

        // Create message with 3D graph data
        const message = {
            type: 'calculator3d',
            text: calculator3dTitle,
            state: currentState,
            preview: imageDataUrl,
            timestamp: Date.now()
        };

        // Add to history and display
        appState.history.push(message);
        appendMessage(message, true);

        // Send to API
        sendToAPI(message);

        // Clear input field after sending
        if (elements.calculator3dTextInput) {
            elements.calculator3dTextInput.value = '';
        }

        showToast('3D Graph shared successfully', 'success');
    } catch (error) {
        console.error('Error sharing 3D graph:', error);
        showToast('Could not share 3D graph: ' + error.message, 'error');
    }
}

function downloadGraph3d() {
    if (!appState.calculator3dInstance) {
        showToast('3D Calculator not initialized', 'error');
        return;
    }

    try {
        showToast('Preparing 3D graph download...', 'info');

        // Capture screenshot at higher quality
        const imageDataUrl = appState.calculator3dInstance.screenshot({
            width: 1200,
            height: 800,
            targetPixelRatio: 2
        });

        if (!imageDataUrl) {
            throw new Error('Failed to capture 3D graph screenshot for download');
        }

        const link = document.createElement('a');
        link.href = imageDataUrl;
        link.download = `3d_graph_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast('3D Graph downloaded successfully', 'success');
    } catch (error) {
        console.error('Error downloading 3D graph:', error);
        showToast('Could not download 3D graph: ' + error.message, 'error');
    }
}

// Function to switch between input modes
function setInputMode(mode) {
    appState.inputMode = mode;

    // Hide all input groups
    if (elements.textInputGroup) elements.textInputGroup.classList.add('d-none');
    if (elements.mathInputGroup) elements.mathInputGroup.classList.add('d-none');
    if (elements.graphInputGroup) elements.graphInputGroup.classList.add('d-none');
    if (elements.geometryInputGroup) elements.geometryInputGroup.classList.add('d-none');
    if (elements.mathCanvasInputGroup) elements.mathCanvasInputGroup.classList.add('d-none');
    if (elements.tilesInputGroup) elements.tilesInputGroup.classList.add('d-none');
    if (elements.calculatorContainer) elements.calculatorContainer.classList.add('d-none');
    if (elements.geometryContainer) elements.geometryContainer.classList.add('d-none');
    if (elements.mathCanvasContainer) elements.mathCanvasContainer.classList.add('d-none');
    if (elements.tilesContainer) elements.tilesContainer.classList.add('d-none');
    if (elements.calculator3dContainer) elements.calculator3dContainer.classList.add('d-none');
    if (elements.calculator3dInputGroup) elements.calculator3dInputGroup.classList.add('d-none');

    if (mode === 'text' && elements.textInputGroup) {
        elements.textInputGroup.classList.remove('d-none');
    } else if (mode === 'math' && elements.mathInputGroup) {
        elements.mathInputGroup.classList.remove('d-none');
    } else if (mode === 'graph') {
        if (elements.graphInputGroup) elements.graphInputGroup.classList.remove('d-none');
        if (elements.calculatorContainer) elements.calculatorContainer.classList.remove('d-none');

        // Initialize calculator if not already done
        if (!appState.calculatorInstance) {
            initializeCalculator();
        }

        // Resize to ensure proper rendering
        if (appState.calculatorInstance) {
            setTimeout(() => {
                appState.calculatorInstance.resize();
            }, 100);
        }
    } else if (mode === 'geometry') {
        if (elements.geometryInputGroup) elements.geometryInputGroup.classList.remove('d-none');
        if (elements.geometryContainer) elements.geometryContainer.classList.remove('d-none');

        // Initialize geometry if not already done
        if (!appState.geometryInstance) {
            initializeGeometry();
        }
    } else if (mode === 'mathcanvas') {
        if (elements.mathCanvasInputGroup) elements.mathCanvasInputGroup.classList.remove('d-none');
        if (elements.mathCanvasContainer) elements.mathCanvasContainer.classList.remove('d-none');

        // Initialize Math Canvas if not already done
        if (!appState.mathCanvasInstance) {
            initializeMathCanvas();
        }
    } else if (mode === 'tiles') {
        if (elements.tilesInputGroup) elements.tilesInputGroup.classList.remove('d-none');
        if (elements.tilesContainer) elements.tilesContainer.classList.remove('d-none');

        // Initialize Polypad if not already done
        if (!appState.tilesInstance) {
            initializePolypad();
        }
    } else if (mode === 'calculator3d') {
        console.log('Setting input mode to calculator3d');
        if (elements.calculator3dInputGroup) {
            elements.calculator3dInputGroup.classList.remove('d-none');
            console.log('Showed calculator3d input group');
        }
        if (elements.calculator3dContainer) {
            elements.calculator3dContainer.classList.remove('d-none');
            console.log('Showed calculator3d container');
        }

        // Initialize 3D Calculator if not already done
        if (!appState.calculator3dInstance) {
            console.log('Initializing 3D calculator...');
            initializeCalculator3d();
        }

        // Resize to ensure proper rendering
        if (appState.calculator3dInstance) {
            setTimeout(() => {
                if (typeof appState.calculator3dInstance.resize === 'function') {
                    appState.calculator3dInstance.resize();
                }
            }, 100);
        }
    }

    // Apply responsive adjustments
    applyResponsiveUI();

    // Notify resize handlers for responsive layouts
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 50);
}

// ===========================================
// 5. MESSAGE HANDLING
// ===========================================

// Message handling functions - optimized for better space usage
function appendMessage(message, isUser = true) {
    if (!elements.chatMessages) {
        console.error('Chat messages container not found');
        return;
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Create message wrapper with more compact dimensions
    const messageWrapper = document.createElement('div');
    messageWrapper.className = `message-wrapper ${isUser ? 'user-message' : 'bot-message'}`;

    // Apply scientist style if applicable
    if (!isUser && appState.selectedScientist && appState.selectedScientist !== 'none') {
        messageWrapper.classList.add(`${appState.selectedScientist}-style`);
    }

    // Create message avatar for bot messages - smaller size
    if (!isUser) {
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar bot-avatar';

        // Display scientist's icon if selected
        if (appState.selectedScientist && appState.selectedScientist !== 'none' &&
            appState.availableScientists[appState.selectedScientist]) {
            avatar.innerHTML = appState.availableScientists[appState.selectedScientist].icon;
        } else {
            avatar.innerHTML = 'PL';
        }

        avatar.style.width = '32px';
        avatar.style.height = '32px';
        avatar.style.fontSize = '14px';
        messageWrapper.appendChild(avatar);
    }

    // Create message content
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.style.padding = '0.75rem'; // Reduced padding

    try {
        // Handle different message types with proper type checking
        if (typeof message === 'object' && message !== null) {
            if (message.type === 'image') {
                // For messages with images
                if (message.text) {
                    const textElement = document.createElement('div');
                    textElement.textContent = message.text;
                    messageContent.appendChild(textElement);
                }

                if (message.preview) {
                    const imgContainer = document.createElement('div');
                    imgContainer.className = 'mt-2';

                    const img = document.createElement('img');
                    img.src = message.preview;
                    img.alt = 'Uploaded image';
                    img.className = 'img-fluid rounded';
                    img.style.maxHeight = '300px'; // Limit height for better space usage

                    // Add click event for image zoom
                    img.addEventListener('click', () => {
                        if (elements.modalImage && elements.imageViewerModal) {
                            elements.modalImage.src = message.preview;
                            elements.imageViewerModal.show();
                        }
                    });

                    imgContainer.appendChild(img);
                    messageContent.appendChild(imgContainer);
                } else {
                    // No preview available, show placeholder text
                    const placeholderDiv = document.createElement('div');
                    placeholderDiv.className = 'mt-2 p-2 bg-light text-center rounded';
                    placeholderDiv.innerHTML = '<i class="bi bi-image"></i> [Image content]';
                    messageContent.appendChild(placeholderDiv);
                }
            } else if (message.type === 'math') {
                // For messages with math expressions
                if (message.text) {
                    const textElement = document.createElement('div');
                    textElement.textContent = message.text;
                    messageContent.appendChild(textElement);
                }

                if (message.latex) {
                    const mathContainer = document.createElement('div');
                    mathContainer.className = 'math-container mt-2 mb-2';
                    // Wrap LaTeX in appropriate delimiters for display mode
                    mathContainer.innerHTML = `$${message.latex}$`;
                    messageContent.appendChild(mathContainer);
                }
            } else if (message.type === 'graph') {
                // For messages with graph data
                if (message.text) {
                    const textElement = document.createElement('div');
                    textElement.textContent = message.text;
                    messageContent.appendChild(textElement);
                }

                // Create graph container
                const graphContainer = document.createElement('div');
                graphContainer.className = 'graph-container mt-2 mb-2';

                // Create graph element with unique ID
                const graphId = 'graph-' + Date.now();
                const graphElement = document.createElement('div');
                graphElement.id = graphId;
                graphElement.style.width = '100%';
                graphElement.style.height = '280px'; // Reduced height

                graphContainer.appendChild(graphElement);
                messageContent.appendChild(graphContainer);

                // Initialize graph after adding to DOM
                setTimeout(() => {
                    if (typeof Desmos !== 'undefined' && typeof Desmos.GraphingCalculator === 'function') {
                        try {
                            const graphInstance = Desmos.GraphingCalculator(graphElement, {
                                expressions: false,
                                zoomButtons: true,
                                settingsMenu: false,
                                border: true
                            });

                            // Set graph state if available
                            if (message.state) {
                                graphInstance.setState(message.state);
                            }
                        } catch (error) {
                            console.error('Error initializing graph in message:', error);
                        }
                    } else {
                        console.warn('Desmos API not available for graph in message');
                    }
                }, 100);
            } else if (message.type === 'geometry') {
                // For messages with geometry constructions
                if (message.text) {
                    const textElement = document.createElement('div');
                    textElement.textContent = message.text;
                    messageContent.appendChild(textElement);
                }

                // Create geometry container
                const geometryContainer = document.createElement('div');
                geometryContainer.className = 'geometry-container-message mt-2 mb-2';

                // If there's a preview image, show it first for immediate feedback
                if (message.preview) {
                    const imgContainer = document.createElement('div');
                    imgContainer.className = 'text-center p-2';

                    const img = document.createElement('img');
                    img.src = message.preview;
                    img.alt = 'Geometry Construction';
                    img.className = 'img-fluid rounded';
                    img.style.maxHeight = '280px'; // Reduced height

                    imgContainer.appendChild(img);
                    geometryContainer.appendChild(imgContainer);
                }

                // Create geometry element with unique ID
                const geometryId = 'geometry-' + Date.now();
                const geometryElement = document.createElement('div');
                geometryElement.id = geometryId;
                geometryElement.style.width = '100%';
                geometryElement.style.height = '280px'; // Reduced height
                geometryElement.className = 'mt-2';

                geometryContainer.appendChild(geometryElement);
                messageContent.appendChild(geometryContainer);

                // Initialize geometry after adding to DOM
                setTimeout(() => {
                    if (typeof Desmos !== 'undefined' && typeof Desmos.Geometry === 'function') {
                        try {
                            const geometryInstance = Desmos.Geometry(geometryElement, {
                                expressions: false,
                                zoomButtons: true,
                                settingsMenu: false,
                                border: true
                            });

                            // Set geometry state if available
                            if (message.state) {
                                geometryInstance.setState(message.state);
                            }
                        } catch (error) {
                            console.error('Error initializing geometry in message:', error);

                            // If there's an error, make sure the preview is showing
                            if (!message.preview && geometryElement.parentNode) {
                                geometryElement.parentNode.removeChild(geometryElement);

                                // Add error message
                                const errorMsg = document.createElement('div');
                                errorMsg.className = 'alert alert-warning mt-2 mb-0';
                                errorMsg.textContent = 'Could not load interactive geometry construction.';
                                geometryContainer.appendChild(errorMsg);
                            }
                        }
                    } else {
                        console.warn('Desmos Geometry API not available for geometry in message');

                        // If no Geometry API, remove the element and just keep preview
                        if (geometryElement.parentNode) {
                            geometryElement.parentNode.removeChild(geometryElement);
                        }
                    }
                }, 100);
            } else if (message.type === 'calculator3d') {
                // For messages with 3D calculator data
                if (message.text) {
                    const textElement = document.createElement('div');
                    textElement.textContent = message.text;
                    messageContent.appendChild(textElement);
                }

                // Create 3D graph container
                const calculator3dContainer = document.createElement('div');
                calculator3dContainer.className = 'calculator3d-container-message mt-2 mb-2';

                // If there's a preview image, show it first for immediate feedback
                if (message.preview) {
                    const imgContainer = document.createElement('div');
                    imgContainer.className = 'text-center p-2';

                    const img = document.createElement('img');
                    img.src = message.preview;
                    img.alt = '3D Graph';
                    img.className = 'img-fluid rounded';
                    img.style.maxHeight = '280px';

                    img.addEventListener('click', () => {
                        if (elements.modalImage && elements.imageViewerModal) {
                            elements.modalImage.src = message.preview;
                            elements.imageViewerModal.show();
                        }
                    });

                    imgContainer.appendChild(img);
                    calculator3dContainer.appendChild(imgContainer);
                }

                // Create 3D calculator element with unique ID
                const calculator3dId = 'calculator3d-' + Date.now();
                const calculator3dElement = document.createElement('div');
                calculator3dElement.id = calculator3dId;
                calculator3dElement.style.width = '100%';
                calculator3dElement.style.height = '280px';

                calculator3dContainer.appendChild(calculator3dElement);
                messageContent.appendChild(calculator3dContainer);

                // Initialize 3D calculator after adding to DOM
                setTimeout(() => {
                    if (typeof Desmos !== 'undefined' && typeof Desmos.Calculator3D === 'function') {
                        try {
                            const calculator3dInstance = Desmos.Calculator3D(calculator3dElement, {
                                expressions: false,
                                zoomButtons: true,
                                settingsMenu: false,
                                border: true
                            });

                            // Set 3D calculator state if available
                            if (message.state) {
                                calculator3dInstance.setState(message.state);
                            }
                        } catch (error) {
                            console.error('Error initializing 3D calculator in message:', error);
                        }
                    } else {
                        console.warn('Desmos 3D API not available for 3D calculator in message');
                    }
                }, 100);
            } else if (message.type === 'mathcanvas') {
                // For messages with math canvas work
                if (message.text) {
                    const textElement = document.createElement('div');
                    textElement.textContent = message.text;
                    messageContent.appendChild(textElement);
                }

                if (message.latex) {
                    const mathContainer = document.createElement('div');
                    mathContainer.className = 'math-container mt-2 mb-2';
                    mathContainer.innerHTML = `$${message.latex}$`;
                    messageContent.appendChild(mathContainer);
                }

                if (message.equation) {
                    const eqContainer = document.createElement('div');
                    eqContainer.className = 'alert alert-light mt-2 mb-2 p-2'; // Reduced padding
                    eqContainer.innerHTML = `<strong>Equation:</strong> ${message.equation}`;
                    messageContent.appendChild(eqContainer);
                }

                // Add preview image if available
                if (message.preview) {
                    const imgContainer = document.createElement('div');
                    imgContainer.className = 'mt-2';
                    const img = document.createElement('img');
                    img.src = message.preview;
                    img.alt = 'Math Canvas Work';
                    img.className = 'img-fluid rounded';
                    img.style.maxHeight = '280px'; // Reduced height

                    // Add click event for image zoom
                    img.addEventListener('click', () => {
                        if (elements.modalImage && elements.imageViewerModal) {
                            elements.modalImage.src = message.preview;
                            elements.imageViewerModal.show();
                        }
                    });

                    imgContainer.appendChild(img);
                    messageContent.appendChild(imgContainer);
                }
            } else if (message.type === 'tiles') {
                // For messages with tiles workspaces
                if (message.text) {
                    const textElement = document.createElement('div');
                    textElement.textContent = message.text;
                    messageContent.appendChild(textElement);
                }

                // Add preview image if available
                if (message.preview) {
                    const imgContainer = document.createElement('div');
                    imgContainer.className = 'mt-2';
                    const img = document.createElement('img');
                    img.src = message.preview;
                    img.alt = 'Polypad Tiles Workspace';
                    img.className = 'img-fluid rounded';
                    img.style.maxHeight = '280px'; // Reduced height

                    // Add click event for image zoom
                    img.addEventListener('click', () => {
                        if (elements.modalImage && elements.imageViewerModal) {
                            elements.modalImage.src = message.preview;
                            elements.imageViewerModal.show();
                        }
                    });

                    imgContainer.appendChild(img);
                    messageContent.appendChild(imgContainer);
                }
            } else {
                // Unknown object type - try to render as text safely
                console.warn('Unknown message object type:', message);
                try {
                    messageContent.textContent = JSON.stringify(message);
                } catch (e) {
                    messageContent.textContent = "[Complex message object]";
                }
            }
        } else {
            // For text messages
            if (isUser) {
                messageContent.textContent = String(message || '');
            } else {
                // For bot messages, render markdown
                messageContent.innerHTML = renderMarkdownAndLaTeX(String(message || ''));

                // Add scientist badge if applicable
                if (appState.selectedScientist && appState.selectedScientist !== 'none' &&
                    appState.availableScientists[appState.selectedScientist]) {
                    const scientist = appState.availableScientists[appState.selectedScientist];
                    const scientistBadge = document.createElement('div');
                    scientistBadge.className = 'scientist-badge';
                    scientistBadge.innerHTML = `${scientist.icon} ${scientist.display_name}`;
                    messageContent.appendChild(scientistBadge);
                }

                // Render LaTeX after adding content to DOM
                setTimeout(() => {
                    renderKaTeX();
                }, 0);
            }
        }
    } catch (error) {
        console.error('Error rendering message:', error, message);
        // Fallback rendering in case of error
        messageContent.textContent = `[Error rendering message: ${error.message}]`;
    }

    // Add message to wrapper
    messageWrapper.appendChild(messageContent);

    // Append to chat messages
    elements.chatMessages.appendChild(messageWrapper);

    // Mark content as changed for scrolling decisions
    appState.lastContentChange = Date.now();

    // Update button states
    updateButtonStates();

    // Ensure proper scrolling with new content
    requestAnimationFrame(() => {
        enhancedScrollToBottom(!appState.manualScrolled);
    });
}

function appendThinking() {
    if (!elements.chatMessages) {
        console.error('Chat messages container not found');
        return;
    }

    // Remove any existing thinking indicator
    removeThinking();

    // Create bot avatar - smaller size
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar bot-avatar';

    // Display scientist's icon if selected
    if (appState.selectedScientist && appState.selectedScientist !== 'none' &&
        appState.availableScientists[appState.selectedScientist]) {
        avatar.innerHTML = appState.availableScientists[appState.selectedScientist].icon;
    } else {
        avatar.innerHTML = 'PL';
    }

    avatar.style.width = '32px';
    avatar.style.height = '32px';
    avatar.style.fontSize = '14px';

    // Create typing indicator - more compact
    const typingContainer = document.createElement('div');
    typingContainer.className = 'message-typing';
    typingContainer.id = 'typingIndicator';
    typingContainer.style.padding = '0.5rem 0.75rem';

    // Add scientist-specific thinking message if applicable
    if (appState.selectedScientist && appState.selectedScientist !== 'none' &&
        appState.availableScientists[appState.selectedScientist]) {
        const scientist = appState.availableScientists[appState.selectedScientist];
        const scientistInfo = document.createElement('span');
        scientistInfo.className = 'scientist-thinking';
        scientistInfo.textContent = `${scientist.icon} ${scientist.display_name} is contemplating this mathematics problem...`;
        typingContainer.appendChild(scientistInfo);
        typingContainer.appendChild(document.createElement('br'));
    }

    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';

    typingContainer.appendChild(typingIndicator);

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper bot-message';

    // Apply scientist style if applicable
    if (appState.selectedScientist && appState.selectedScientist !== 'none') {
        wrapper.classList.add(`${appState.selectedScientist}-style`);
    }

    wrapper.appendChild(avatar);
    wrapper.appendChild(typingContainer);

    // Append to chat
    elements.chatMessages.appendChild(wrapper);

    // Mark content as changed for scrolling decisions
    appState.lastContentChange = Date.now();

    // Ensure we scroll to see the typing indicator
    enhancedScrollToBottom(true);
}

function removeThinking() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator && typingIndicator.parentElement) {
        typingIndicator.parentElement.remove();
    }
}

// ===========================================
// 6. API COMMUNICATION
// ===========================================

// Fetch chatbots from API with user mode filter
async function fetchChatbots(userMode = 'all') {
    try {
        updateConnectionStatus('connecting', 'Fetching chatbots...');

        const url = userMode === 'all' ? '/api/chatbots' : `/api/chatbots?user_mode=${userMode}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        appState.availableBots = data;

        // Populate bot options
        populateBotOptions();

        updateConnectionStatus('online', 'Connected');
        return data;
    } catch (error) {
        console.error('Error fetching chatbots:', error);
        showToast('Failed to fetch chatbots: ' + error.message, 'error');
        updateConnectionStatus('offline', 'Connection error');
        return {};
    }
}

// Fetch curriculum data from API
async function fetchCurriculum(grade) {
    try {
        const encodedGrade = encodeURIComponent(grade || '');
        const response = await fetch(`/api/curriculum?grade=${encodedGrade}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.curriculum) {
            appState.availableCurriculum = data.curriculum;
            populateGradeOptions();
        }

        return data.topics || [];
    } catch (error) {
        console.error('Error fetching curriculum:', error);
        showToast('Failed to fetch curriculum: ' + error.message, 'error');
        return [];
    }
}

// Fetch scientists data from API
async function fetchScientists(grade = '', topic = '') {
    try {
        let url = '/api/scientists';
        if (grade) {
            url += `?grade=${encodeURIComponent(grade)}`;
            if (topic) {
                url += `&topic=${encodeURIComponent(topic)}`;
            }
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status === 'success') {
            appState.availableScientists = data.scientists;
            populateScientistCards(grade, topic);
            return data.scientists;
        } else {
            throw new Error('Failed to fetch scientists data');
        }
    } catch (error) {
        console.error('Error fetching scientists:', error);
        showToast('Failed to fetch scientists data', 'error');
        return {};
    }
}

// Fetch user modes data from API
async function fetchUserModes() {
    try {
        const response = await fetch('/api/user_modes');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status === 'success') {
            appState.availableUserModes = data.user_modes;
            populateUserModeCards();
            return data.user_modes;
        } else {
            throw new Error('Failed to fetch user modes data');
        }
    } catch (error) {
        console.error('Error fetching user modes:', error);
        showToast('Failed to fetch user modes data', 'error');
        return {};
    }
}

// Fetch collaboration modes and pairs from API
async function fetchCollaborationData() {
    try {
        const response = await fetch('/api/collaboration/all');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status === 'success') {
            appState.availableCollaborationModes = data.data.modes;
            appState.availableCollaborationPairs = data.data.pairs;
            populateCollaborationModeCards();
            return data.data;
        } else {
            throw new Error('Failed to fetch collaboration data');
        }
    } catch (error) {
        console.error('Error fetching collaboration data:', error);
        showToast('Failed to fetch collaboration data', 'error');
        return {};
    }
}

// Fetch collaboration pairs for specific mode
async function fetchCollaborationPairs(mode) {
    try {
        const response = await fetch(`/api/collaboration/pairs/${mode}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status === 'success') {
            return data.pairs;
        } else {
            throw new Error('Failed to fetch collaboration pairs');
        }
    } catch (error) {
        console.error('Error fetching collaboration pairs:', error);
        showToast(`Failed to fetch collaboration pairs: ${error.message}`, 'error');
        return {};
    }
}

// Populate user mode cards
function populateUserModeCards() {
    // Clear existing cards
    if (!elements.userModeSelection) {
        console.warn('User mode selection element not found');
        return;
    }

    elements.userModeSelection.innerHTML = '';

    if (!appState.availableUserModes || Object.keys(appState.availableUserModes).length === 0) {
        elements.userModeSelection.innerHTML = `
            <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle"></i> No user modes data available. Please check your connection.
            </div>
        `;
        return;
    }

    // Create user mode cards
    Object.keys(appState.availableUserModes).forEach(key => {
        const userMode = appState.availableUserModes[key];

        const card = document.createElement('div');
        card.className = `user-mode-card ${appState.userMode === key ? 'selected' : ''}`;
        card.dataset.userMode = key;

        // Create features list
        const featuresList = userMode.features.map(feature =>
            `<li>${feature}</li>`
        ).join('');

        card.innerHTML = `
            <div class="user-mode-card-header">
                <div class="user-mode-icon">${userMode.display_name.split(' ')[0]}</div>
                <h5 class="user-mode-name">${userMode.display_name}</h5>
            </div>
            <div class="user-mode-card-body">
                <p class="user-mode-description">${userMode.description}</p>
                <div class="user-mode-features">
                    <h6><i class="bi bi-star-fill me-1"></i> Features:</h6>
                    <ul class="feature-list">
                        ${featuresList}
                    </ul>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            selectUserMode(key);
        });

        elements.userModeSelection.appendChild(card);
    });
}

// Select a user mode
function selectUserMode(modeKey) {
    // Update selected state in UI
    document.querySelectorAll('.user-mode-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.userMode === modeKey) {
            card.classList.add('selected');
        }
    });

    // Update app state
    appState.userMode = modeKey;

    // Update user mode detail
    updateUserModeDetail(modeKey);
    
    // Update scientist tab visibility based on selected user mode
    updateScientistTabVisibility(modeKey);
    
    // Fetch and update chatbots based on selected user mode
    fetchChatbots(modeKey).then(() => {
        // Auto-select appropriate default bot
        const availableBotKeys = Object.keys(appState.availableBots);
        if (availableBotKeys.length > 0) {
            if (modeKey === 'student') {
                appState.selectedBot = availableBotKeys.includes('plama') ? 'plama' : availableBotKeys[0];
            } else if (modeKey === 'lecturer') {
                appState.selectedBot = availableBotKeys.includes('plama_ta') ? 'plama_ta' : availableBotKeys[0];
            }
            
            // Update bot selection UI
            updateBotSelection();
        }
    });
}

// Update bot selection UI after user mode change
function updateBotSelection() {
    // Update radio button selection
    const botRadios = document.querySelectorAll('input[name="botOption"]');
    botRadios.forEach(radio => {
        radio.checked = radio.value === appState.selectedBot;
    });
    
    // Update bot description
    updateBotDescription();
}

// Update user mode detail display
function updateUserModeDetail(modeKey) {
    const userModeDetail = elements.userModeDetail;

    if (!modeKey || !appState.availableUserModes[modeKey]) {
        userModeDetail.classList.add('d-none');
        return;
    }

    const userMode = appState.availableUserModes[modeKey];

    // Create features list for detail view
    const detailFeaturesList = userMode.features.map(feature =>
        `<span class="feature-badge">${feature}</span>`
    ).join(' ');

    userModeDetail.innerHTML = `
        <div class="d-flex align-items-center mb-3">
            <span class="user-mode-icon me-2">${userMode.display_name.split(' ')[0]}</span>
            <h5 class="mb-0">${userMode.display_name}</h5>
        </div>
        <p>${userMode.description}</p>
        <div class="user-mode-features-detail">
            <h6><i class="bi bi-gear-fill me-1"></i> คุณสมบัติหลัก:</h6>
            <div>${detailFeaturesList}</div>
        </div>
    `;

    userModeDetail.classList.remove('d-none');
}

// Update scientist tab visibility based on user mode
function updateScientistTabVisibility(modeKey) {
    const scientistTab = document.getElementById('scientist-tab');

    if (!scientistTab) return;

    // For now, both modes support scientist selection
    // In the future, you might want to restrict certain modes
    scientistTab.classList.remove('disabled');
    scientistTab.removeAttribute('disabled');

    // Add CSS for feature badges if not already added
    if (!document.getElementById('userModeStyles')) {
        const style = document.createElement('style');
        style.id = 'userModeStyles';
        style.textContent = `
        .feature-badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            margin: 0.15rem;
            border-radius: 1rem;
            font-size: 0.75rem;
            background-color: rgba(44, 123, 229, 0.1);
            color: #2C7BE5;
            border: 1px solid rgba(44, 123, 229, 0.2);
        }
        
        .user-mode-features-detail {
            margin-top: 1rem;
            font-size: 0.85rem;
        }
        
        .user-mode-features-detail h6 {
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
            color: #2C7BE5;
        }
    `;
        document.head.appendChild(style);
    }
}

// Populate collaboration mode cards
function populateCollaborationModeCards() {
    const collaborationModeSelection = document.getElementById('collaborationModeSelection');
    
    if (!collaborationModeSelection) {
        console.warn('Collaboration mode selection element not found');
        return;
    }

    collaborationModeSelection.innerHTML = '';

    if (!appState.availableCollaborationModes || Object.keys(appState.availableCollaborationModes).length === 0) {
        collaborationModeSelection.innerHTML = `
            <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle"></i> No collaboration modes data available. Please check your connection.
            </div>
        `;
        return;
    }

    // Create collaboration mode cards
    Object.keys(appState.availableCollaborationModes).forEach(key => {
        const mode = appState.availableCollaborationModes[key];

        const card = document.createElement('div');
        card.className = `collaboration-mode-card ${appState.collaborationMode === key ? 'selected' : ''}`;
        card.dataset.collaborationMode = key;

        card.innerHTML = `
            <div class="collaboration-mode-card-header">
                <div class="collaboration-mode-icon">${mode.icon}</div>
                <h5 class="collaboration-mode-name">${mode.display_name}</h5>
            </div>
            <div class="collaboration-mode-card-body">
                <p class="collaboration-mode-description">${mode.description}</p>
            </div>
        `;

        card.addEventListener('click', () => {
            selectCollaborationMode(key);
        });

        collaborationModeSelection.appendChild(card);
    });
}

// Select a collaboration mode
function selectCollaborationMode(modeKey) {
    // Update selected state in UI
    document.querySelectorAll('.collaboration-mode-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.collaborationMode === modeKey) {
            card.classList.add('selected');
        }
    });

    // Update app state
    appState.collaborationMode = modeKey;

    // Update collaboration mode detail
    updateCollaborationModeDetail(modeKey);
    
    // Update collaboration pair selection based on selected mode
    updateCollaborationPairSelection(modeKey);
}

// Update collaboration mode detail display
function updateCollaborationModeDetail(modeKey) {
    const collaborationModeDetail = document.getElementById('collaborationModeDetail');

    if (!modeKey || !appState.availableCollaborationModes[modeKey]) {
        if (collaborationModeDetail) {
            collaborationModeDetail.classList.add('d-none');
        }
        return;
    }

    const mode = appState.availableCollaborationModes[modeKey];

    if (collaborationModeDetail) {
        collaborationModeDetail.innerHTML = `
            <div class="d-flex align-items-center mb-3">
                <span class="collaboration-mode-icon me-2">${mode.icon}</span>
                <h5 class="mb-0">${mode.display_name}</h5>
            </div>
            <p>${mode.description}</p>
        `;

        collaborationModeDetail.classList.remove('d-none');
    }
}

// Update collaboration pair selection based on mode
async function updateCollaborationPairSelection(modeKey) {
    const collaborationPairSelection = document.getElementById('collaborationPairSelection');
    
    if (!collaborationPairSelection) {
        console.warn('Collaboration pair selection element not found');
        return;
    }

    // Clear existing pairs
    collaborationPairSelection.innerHTML = '';

    if (modeKey === 'single') {
        // Hide pair selection for single mode
        const collaborationPairGroup = document.getElementById('collaborationPairGroup');
        if (collaborationPairGroup) {
            collaborationPairGroup.classList.add('d-none');
        }
        appState.collaborationPair = 'none';
        updateCollaborationPairDetail('none');
        return;
    }

    // Show pair selection for harmony and debate modes
    const collaborationPairGroup = document.getElementById('collaborationPairGroup');
    if (collaborationPairGroup) {
        collaborationPairGroup.classList.remove('d-none');
    }

    try {
        showToast('Loading collaboration pairs...', 'info');
        
        const pairs = await fetchCollaborationPairs(modeKey);
        
        if (!pairs || Object.keys(pairs).length === 0) {
            collaborationPairSelection.innerHTML = `
                <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle"></i> No collaboration pairs available for this mode.
                </div>
            `;
            return;
        }

        // Add "None" option
        const noneCard = document.createElement('div');
        noneCard.className = `collaboration-pair-card ${appState.collaborationPair === 'none' ? 'selected' : ''}`;
        noneCard.dataset.collaborationPair = 'none';
        noneCard.innerHTML = `
            <div class="collaboration-pair-card-header">
                <div class="collaboration-pair-icons">❌</div>
                <h6 class="collaboration-pair-name">ไม่ใช้การร่วมมือ</h6>
            </div>
            <div class="collaboration-pair-card-body">
                <p class="collaboration-pair-description">การสอนแบบปกติ</p>
            </div>
        `;
        noneCard.addEventListener('click', () => selectCollaborationPair('none'));
        collaborationPairSelection.appendChild(noneCard);

        // Create collaboration pair cards
        Object.keys(pairs).forEach(key => {
            const pair = pairs[key];

            const card = document.createElement('div');
            card.className = `collaboration-pair-card ${appState.collaborationPair === key ? 'selected' : ''}`;
            card.dataset.collaborationPair = key;

            // Create mathematician icons display
            const iconsDisplay = pair.mathematician_icons ? 
                pair.mathematician_icons.join(' ') : '👨‍🏫👨‍🏫';

            card.innerHTML = `
                <div class="collaboration-pair-card-header">
                    <div class="collaboration-pair-icons">${iconsDisplay}</div>
                    <h6 class="collaboration-pair-name">${pair.thai_name}</h6>
                </div>
                <div class="collaboration-pair-card-body">
                    <p class="collaboration-pair-description">${pair.description}</p>
                    <div class="collaboration-pair-mathematicians">
                        <small><strong>นักคณิตศาสตร์:</strong> ${pair.mathematician_names ? pair.mathematician_names.join(' และ ') : 'ไม่ระบุ'}</small>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => {
                selectCollaborationPair(key);
            });

            collaborationPairSelection.appendChild(card);
        });

        showToast('Collaboration pairs loaded successfully', 'success');
    } catch (error) {
        console.error('Error updating collaboration pair selection:', error);
        collaborationPairSelection.innerHTML = `
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle"></i> Error loading collaboration pairs: ${error.message}
            </div>
        `;
    }
}

// Select a collaboration pair
function selectCollaborationPair(pairKey) {
    // Update selected state in UI
    document.querySelectorAll('.collaboration-pair-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.collaborationPair === pairKey) {
            card.classList.add('selected');
        }
    });

    // Update app state
    appState.collaborationPair = pairKey;

    // Update collaboration pair detail
    updateCollaborationPairDetail(pairKey);
}

// Update collaboration pair detail display
function updateCollaborationPairDetail(pairKey) {
    const collaborationPairDetail = document.getElementById('collaborationPairDetail');

    if (!collaborationPairDetail) {
        console.warn('Collaboration pair detail element not found');
        return;
    }

    if (pairKey === 'none' || !appState.availableCollaborationPairs[pairKey]) {
        collaborationPairDetail.classList.add('d-none');
        return;
    }

    const pair = appState.availableCollaborationPairs[pairKey];

    // Create recommended topics badges
    let topicBadges = '';
    if (pair.recommended_topics && pair.recommended_topics.length > 0) {
        topicBadges = pair.recommended_topics.map(topic =>
            `<span class="topic-badge">${topic}</span>`
        ).join(' ');
    }

    collaborationPairDetail.innerHTML = `
        <div class="d-flex align-items-center mb-3">
            <span class="collaboration-pair-icons me-2">${pair.mathematician_icons ? pair.mathematician_icons.join(' ') : '👨‍🏫👨‍🏫'}</span>
            <h6 class="mb-0">${pair.thai_name}</h6>
        </div>
        <p>${pair.description}</p>
        <div class="collaboration-pair-mathematicians mb-2">
            <strong>นักคณิตศาสตร์:</strong> ${pair.mathematician_names ? pair.mathematician_names.join(' และ ') : 'ไม่ระบุ'}
        </div>
        <div class="collaboration-pair-style mb-2">
            <strong>รูปแบบการสอน:</strong> ${pair.style || 'ไม่ระบุ'}
        </div>
        ${topicBadges ? `
        <div class="collaboration-pair-topics">
            <h6><i class="bi bi-star-fill me-1"></i> หัวข้อที่แนะนำ:</h6>
            <div>${topicBadges}</div>
        </div>
        ` : ''}
    `;

    collaborationPairDetail.classList.remove('d-none');
}

// Load scientist detail from API with enhanced data
async function loadScientistDetail(scientistKey) {
    try {
        if (scientistKey === 'none') {
            updateScientistDetail(scientistKey);
            return;
        }

        // Show basic information immediately
        updateScientistDetail(scientistKey);

        // Return immediately if we have cached data
        if (appState.scientistDetailsCache[scientistKey]) {
            updateScientistDetailWithEnrichedData(scientistKey, appState.scientistDetailsCache[scientistKey]);
            return;
        }

        // Add a subtle loading indicator to the scientist detail panel
        const detailPanel = elements.scientistDetail;
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator mt-2';
        loadingIndicator.innerHTML = '<div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div><small>Loading additional information...</small>';
        detailPanel.appendChild(loadingIndicator);

        // Fetch enhanced data in the background
        const response = await fetch(`/api/scientists/detail?key=${scientistKey}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status === 'success') {
            // Cache the detailed data
            appState.scientistDetailsCache[scientistKey] = data.scientist;

            // Remove loading indicator
            const indicator = detailPanel.querySelector('.loading-indicator');
            if (indicator) indicator.remove();

            // Update display with enhanced data
            updateScientistDetailWithEnrichedData(scientistKey, data.scientist);
        } else {
            throw new Error('Failed to fetch scientist data');
        }
    } catch (error) {
        console.error('Error loading scientist detail:', error);
        // Remove loading indicator if exists
        const detailPanel = elements.scientistDetail;
        const indicator = detailPanel.querySelector('.loading-indicator');
        if (indicator) indicator.remove();

        // Basic info is already displayed, so no further action needed
    }
}

// Initialize chat with selected options
async function initializeChatbot() {
    try {
        updateConnectionStatus('connecting', 'Initializing chatbot...');

        const data = {
            bot_key: appState.selectedBot,
            grade: appState.grade,
            topic: appState.topic,
            temperature: appState.temperature,
            max_completion_tokens: appState.maxTokens,
            scientist_key: appState.selectedScientist,
            user_mode: appState.userMode,
            collaboration_mode: appState.collaborationMode,
            collaboration_pair: appState.collaborationPair
        };

        const response = await fetch('/api/initialize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === 'success') {
            // Update app state
            appState.initialized = true;
            appState.api_state = result.api_state;
            appState.grade = result.grade;
            appState.topic = result.topic;
            appState.userMode = result.user_mode || 'student';
            appState.collaborationMode = result.api_state.collaboration_mode || 'single';
            appState.collaborationPair = result.api_state.collaboration_pair || 'none';
            appState.manualScrolled = false; // Reset manual scroll flag

            // Show chat container
            if (elements.welcomeScreen) elements.welcomeScreen.classList.add('d-none');
            if (elements.chatContainer) elements.chatContainer.classList.remove('d-none');
            if (elements.chatInputContainer) elements.chatInputContainer.classList.remove('d-none');

            // Clear chat messages
            if (elements.chatMessages) elements.chatMessages.innerHTML = '';

            // Remove scroll button if exists
            const scrollBtn = document.getElementById('scrollBottomBtn');
            if (scrollBtn) scrollBtn.remove();

            const selectedBotName = appState.availableBots[appState.selectedBot]?.display_name || "PLAMA";
            const userModeDisplay = appState.availableUserModes[appState.userMode]?.display_name || "Student Mode";
            let welcomeMessage = `พร้อมช่วยเหลือคุณเกี่ยวกับคณิตศาสตร์ระดับ ${appState.grade}\nหัวข้อ: ${appState.topic || 'ทั่วไป'}\nโหมดการใช้งาน: ${userModeDisplay}\n\n`;

            // Add scientist info if selected
            if (result.collaboration && appState.collaborationMode !== 'single') {
                welcomeMessage += `\n🤝 **${result.collaboration.thai_name}**\n`;
                welcomeMessage += `${result.collaboration.description}\n`;
                welcomeMessage += `นักคณิตศาสตร์: ${result.collaboration.mathematician_names.join(' และ ')}\n\n`;
            } else if (result.scientist && appState.selectedScientist !== 'none') {
                welcomeMessage += `\n🧑‍🏫 **การสอนสไตล์ ${result.scientist.display_name}**\n`;
                welcomeMessage += `${result.scientist.teaching_style}\n\n`;
            }

            welcomeMessage += "คุณสามารถถามคำถามเกี่ยวกับคณิตศาสตร์ได้ทุกเมื่อ!";

            if (elements.chatMessages) {
                const welcomeCard = document.createElement('div');
                welcomeCard.className = 'card mb-3'; // Reduced margin
                welcomeCard.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)'; // Lighter shadow
                welcomeCard.innerHTML = `
                    <div class="card-body p-3">
                        <div class="d-flex align-items-center mb-2">
                            <div class="message-avatar bot-avatar me-2" style="width:32px;height:32px;font-size:14px;">${result.scientist ? result.scientist.icon : 'PL'}</div>
                            <h5 class="card-title mb-0" style="font-size:1rem;">${selectedBotName}</h5>
                        </div>
                        <div class="card-text" style="font-size:0.9rem;">
                            ${renderMarkdownAndLaTeX(welcomeMessage)}
                        </div>
                    </div>
                `;
                elements.chatMessages.appendChild(welcomeCard);
            }

            // Initialize empty history array
            appState.history = [];

            // Update connection status
            updateConnectionStatus('online', 'Ready');

            // Update button states
            updateButtonStates();

            // Close settings modal if open
            if (elements.settingsModal) {
                elements.settingsModal.hide();
            }

            // Force scroll to bottom for welcome message
            setTimeout(() => enhancedScrollToBottom(true), 100);

            // Render KaTeX for welcome message
            renderKaTeX();

            showToast(result.message, 'success');
            return true;
        } else {
            updateConnectionStatus('offline', 'Initialization failed');
            showToast(result.message, 'error');
            return false;
        }
    } catch (error) {
        console.error('Error initializing chatbot:', error);
        updateConnectionStatus('offline', 'Connection error');
        showToast(`Error initializing chatbot: ${error.message}`, 'error');
        return false;
    }
}

// Function to send message to API
async function sendToAPI(message) {
    // Stop any active EventSource
    if (appState.eventSource) {
        appState.eventSource.close();
    }

    try {
        // Show thinking indicator
        appendThinking();

        // Create request ID
        const requestId = Date.now().toString();

        // Prepare data for API
        let chatData;

        if (typeof message === 'object') {
            if (message.type === 'image') {
                // If message contains an image
                chatData = {
                    history: appState.history,
                    api_state: appState.api_state,
                    grade: appState.grade,
                    topic: appState.topic,
                    message: {
                        text: message.text || "",
                        type: "image",
                        image_data: {
                            preview: message.preview,
                            file_name: message.fileName || "uploaded-image.jpg"
                        }
                    },
                    request_id: requestId
                };
            } else if (message.type === 'math') {
                // If message contains a math expression
                chatData = {
                    history: appState.history,
                    api_state: appState.api_state,
                    grade: appState.grade,
                    topic: appState.topic,
                    message: {
                        text: message.text || "",
                        type: "math",
                        latex: message.latex || ""
                    },
                    request_id: requestId
                };
            } else if (message.type === 'graph') {
                // If message contains a graph
                chatData = {
                    history: appState.history,
                    api_state: appState.api_state,
                    grade: appState.grade,
                    topic: appState.topic,
                    message: {
                        text: message.text || "I shared a graph with you",
                        type: "graph",
                        state: message.state
                    },
                    request_id: requestId
                };
            } else if (message.type === 'calculator3d') {
                // If message contains a 3D calculator
                chatData = {
                    history: appState.history,
                    api_state: appState.api_state,
                    grade: appState.grade,
                    topic: appState.topic,
                    message: {
                        text: message.text || "I shared a 3D graph with you",
                        type: "calculator3d",
                        state: message.state
                    },
                    request_id: requestId
                };
            } else if (message.type === 'geometry') {
                // If message contains a geometry construction
                chatData = {
                    history: appState.history,
                    api_state: appState.api_state,
                    grade: appState.grade,
                    topic: appState.topic,
                    message: {
                        text: message.text || "I shared a geometry construction",
                        type: "geometry",
                        state: message.state
                    },
                    request_id: requestId
                };
            }
        } else {
            // If regular text message
            chatData = {
                history: appState.history,
                api_state: appState.api_state,
                grade: appState.grade,
                topic: appState.topic,
                message: { text: message },
                request_id: requestId
            };
        }

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chatData)
        });

        const result = await response.json();

        if (result.status !== 'success') {
            removeThinking();
            showToast(result.message, 'error');
            return;
        }

        // Start EventSource for streaming response
        const url = `/api/chat/stream?request_id=${requestId}`;
        appState.eventSource = new EventSource(url);

        // Variable to store full response
        let fullResponse = '';

        // Reset manual scroll flag when receiving new content
        appState.manualScrolled = false;

        // Remove scroll button if exists
        const scrollBtn = document.getElementById('scrollBottomBtn');
        if (scrollBtn) scrollBtn.remove();

        // EventSource event handlers - optimized for performance
        appState.eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                switch (data.type) {
                    case 'thinking':
                        // Update thinking indicator
                        break;

                    case 'chunk':
                        // Received a chunk of the message
                        fullResponse += data.content;
                        appState.lastContentChange = Date.now();

                        // Remove thinking indicator
                        removeThinking();

                        // Find the latest bot message (if any)
                        const botElements = document.querySelectorAll('.bot-message');
                        const lastBotElement = botElements.length > 0 ? botElements[botElements.length - 1] : null;

                        // If there's already a bot message for this response
                        if (lastBotElement && lastBotElement.dataset.responseTo === requestId) {
                            // Update existing message content
                            const messageContent = lastBotElement.querySelector('.message-content');
                            if (messageContent) {
                                messageContent.innerHTML = renderMarkdownAndLaTeX(fullResponse);

                                // Render KaTeX for updated content
                                renderKaTeX();
                            }
                        } else {
                            // If there's no bot message for this response yet, create one
                            const messageWrapper = document.createElement('div');
                            messageWrapper.className = 'message-wrapper bot-message';
                            messageWrapper.dataset.responseTo = requestId;

                            // Apply scientist style if applicable
                            if (appState.selectedScientist && appState.selectedScientist !== 'none') {
                                messageWrapper.classList.add(`${appState.selectedScientist}-style`);
                            }

                            // Create bot avatar - smaller size
                            const avatar = document.createElement('div');
                            avatar.className = 'message-avatar bot-avatar';

                            // Display scientist's icon if selected
                            if (appState.selectedScientist && appState.selectedScientist !== 'none' &&
                                appState.availableScientists[appState.selectedScientist]) {
                                avatar.innerHTML = appState.availableScientists[appState.selectedScientist].icon;
                            } else {
                                avatar.innerHTML = 'PL';
                            }

                            avatar.style.width = '32px';
                            avatar.style.height = '32px';
                            avatar.style.fontSize = '14px';
                            messageWrapper.appendChild(avatar);

                            // Create message content
                            const messageContent = document.createElement('div');
                            messageContent.className = 'message-content';
                            messageContent.style.padding = '0.75rem'; // Reduced padding
                            messageContent.innerHTML = renderMarkdownAndLaTeX(fullResponse);

                            // Add scientist badge if applicable
                            if (appState.selectedScientist && appState.selectedScientist !== 'none' &&
                                appState.availableScientists[appState.selectedScientist]) {
                                const scientist = appState.availableScientists[appState.selectedScientist];
                                const scientistBadge = document.createElement('div');
                                scientistBadge.className = 'scientist-badge';
                                scientistBadge.innerHTML = `${scientist.icon} ${scientist.display_name}`;
                                messageContent.appendChild(scientistBadge);
                            }

                            messageWrapper.appendChild(messageContent);
                            if (elements.chatMessages) {
                                elements.chatMessages.appendChild(messageWrapper);
                            }

                            // Render KaTeX for new content
                            renderKaTeX();
                        }

                        // Scroll to see new content
                        enhancedScrollToBottom(!appState.manualScrolled);
                        break;

                    case 'done':
                        // Received complete message
                        fullResponse = data.content;
                        appState.lastContentChange = Date.now();

                        // Add to history
                        appState.history.push(fullResponse);

                        // Remove thinking indicator
                        removeThinking();

                        // Find the latest bot message (if any)
                        const doneElements = document.querySelectorAll('.bot-message');
                        const lastElement = doneElements.length > 0 ? doneElements[doneElements.length - 1] : null;

                        // If there's already a bot message for this response
                        if (lastElement && lastElement.dataset.responseTo === requestId) {
                            // Update existing message content
                            const messageContent = lastElement.querySelector('.message-content');
                            if (messageContent) {
                                messageContent.innerHTML = renderMarkdownAndLaTeX(fullResponse);

                                // Make sure scientist badge exists if applicable
                                if (appState.selectedScientist && appState.selectedScientist !== 'none' &&
                                    appState.availableScientists[appState.selectedScientist]) {

                                    // Check if badge already exists
                                    let badge = messageContent.querySelector('.scientist-badge');
                                    if (!badge) {
                                        const scientist = appState.availableScientists[appState.selectedScientist];
                                        const scientistBadge = document.createElement('div');
                                        scientistBadge.className = 'scientist-badge';
                                        scientistBadge.innerHTML = `${scientist.icon} ${scientist.display_name}`;
                                        messageContent.appendChild(scientistBadge);
                                    }
                                }

                                // Render KaTeX for final content - improved with multiple renders at different intervals
                                renderKaTeX(); // Immediate rendering

                                // Add multiple delayed renderings to ensure all LaTeX expressions are processed
                                setTimeout(() => renderKaTeX(), 300);  // Short delay
                                setTimeout(() => renderKaTeX(), 800);  // Medium delay
                                setTimeout(() => renderKaTeX(), 1500); // Longer delay
                                setTimeout(() => renderKaTeX(), 3000); // Safety net final render
                            }
                        } else {
                            // If there's no bot message for this response yet, create one
                            appendMessage(fullResponse, false);

                            // Render KaTeX for new message with multiple renders at different intervals
                            renderKaTeX();
                            setTimeout(() => renderKaTeX(), 300);
                            setTimeout(() => renderKaTeX(), 800);
                            setTimeout(() => renderKaTeX(), 1500);
                            setTimeout(() => renderKaTeX(), 3000);
                        }

                        // Update button states
                        updateButtonStates();

                        // Scroll to latest message
                        enhancedScrollToBottom(!appState.manualScrolled);

                        // Close EventSource
                        appState.eventSource.close();
                        appState.eventSource = null;
                        break;

                    case 'error':
                        // Error occurred
                        removeThinking();
                        showToast(data.content, 'error');

                        // Close EventSource
                        appState.eventSource.close();
                        appState.eventSource = null;
                        break;
                }
            } catch (error) {
                console.error('Error parsing event data:', error, event.data);
                removeThinking();
                showToast('Error processing response: ' + error.message, 'error');

                // Close EventSource on error
                if (appState.eventSource) {
                    appState.eventSource.close();
                    appState.eventSource = null;
                }
            }
        };

        // Handle EventSource errors
        appState.eventSource.onerror = (error) => {
            console.error('EventSource error:', error);
            removeThinking();
            showToast('Connection error. Please try again.', 'error');

            // Close EventSource
            appState.eventSource.close();
            appState.eventSource = null;
        };

    } catch (error) {
        console.error('Error sending message to API:', error);
        removeThinking();
        showToast(`Error sending message: ${error.message}`, 'error');
    }
}

// Function to undo last message
async function undoLast() {
    try {
        if (appState.history.length === 0) return;

        const response = await fetch('/api/undo_last', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                history: appState.history
            })
        });

        const result = await response.json();

        if (result.status === 'success') {
            appState.history = result.history;
            appState.manualScrolled = false; // Reset manual scroll flag

            // Update UI
            if (elements.chatMessages) elements.chatMessages.innerHTML = '';

            // Show all remaining messages
            for (let i = 0; i < appState.history.length; i++) {
                const message = appState.history[i];
                const isUser = (i % 2 === 0); // Even indexes (0, 2, 4) are user messages
                appendMessage(message, isUser);
            }

            updateButtonStates();

            // Remove scroll button if exists
            const scrollBtn = document.getElementById('scrollBottomBtn');
            if (scrollBtn) scrollBtn.remove();

            // Force scroll to bottom for re-rendered messages
            setTimeout(() => enhancedScrollToBottom(true), 100);

            // Render KaTeX for updated messages
            renderKaTeX();
        } else {
            showToast(result.message, 'error');
        }
    } catch (error) {
        console.error('Error undoing last message:', error);
        showToast(`Error undoing last message: ${error.message}`, 'error');
    }
}

// Function to retry last message
async function retryLast() {
    try {
        if (appState.history.length === 0) return;

        const response = await fetch('/api/retry_last', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                history: appState.history
            })
        });

        const result = await response.json();

        if (result.status === 'success') {
            appState.history = result.history;
            appState.manualScrolled = false; // Reset manual scroll flag

            // Get the last message
            const lastUserMessage = appState.history[appState.history.length - 1];

            // Update UI
            if (elements.chatMessages) {
                elements.chatMessages.innerHTML = '';

                for (let i = 0; i < appState.history.length; i++) {
                    const message = appState.history[i];
                    const isUser = (i % 2 === 0); // Even indexes (0, 2, 4) are user messages
                    appendMessage(message, isUser);
                }
            }

            // Remove scroll button if exists
            const scrollBtn = document.getElementById('scrollBottomBtn');
            if (scrollBtn) scrollBtn.remove();

            sendToAPI(lastUserMessage);

            updateButtonStates();

            // Render KaTeX
            renderKaTeX();
        } else {
            showToast(result.message, 'error');
        }
    } catch (error) {
        console.error('Error retrying last message:', error);
        showToast(`Error retrying last message: ${error.message}`, 'error');
    }
}

// Function to clear chat
async function clearChat() {
    try {
        if (!confirm('Do you want to clear all messages?')) return;

        const response = await fetch('/api/clear_chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.status === 'success') {
            appState.history = [];
            appState.manualScrolled = false; // Reset manual scroll flag

            if (elements.chatMessages) {
                elements.chatMessages.innerHTML = '';

                // Remove scroll button if exists
                const scrollBtn = document.getElementById('scrollBottomBtn');
                if (scrollBtn) scrollBtn.remove();

                const selectedBotName = appState.availableBots[appState.selectedBot]?.display_name || "PLAMA";
                const userModeDisplay = appState.availableUserModes[appState.userMode]?.display_name || "Student Mode";
                let welcomeMessage = `พร้อมช่วยเหลือคุณเกี่ยวกับคณิตศาสตร์ระดับ ${appState.grade}\nหัวข้อ: ${appState.topic || 'ทั่วไป'}\nโหมดการใช้งาน: ${userModeDisplay}\n\n`;

                // Add scientist info if selected
                if (appState.selectedScientist !== 'none' && appState.availableScientists[appState.selectedScientist]) {
                    const scientist = appState.availableScientists[appState.selectedScientist];
                    welcomeMessage += `\n🧑‍🏫 **การสอนสไตล์ ${scientist.display_name}**\n`;
                    welcomeMessage += `${scientist.teaching_style}\n\n`;
                }

                welcomeMessage += "คุณสามารถถามคำถามเกี่ยวกับคณิตศาสตร์ได้ทุกเมื่อ!";

                // More compact welcome card
                const welcomeCard = document.createElement('div');
                welcomeCard.className = 'card mb-3'; // Reduced margin
                welcomeCard.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)'; // Lighter shadow

                // Add scientist icon if applicable
                const scientistIcon = (appState.selectedScientist !== 'none' &&
                    appState.availableScientists[appState.selectedScientist]) ?
                    appState.availableScientists[appState.selectedScientist].icon : 'PL';

                welcomeCard.innerHTML = `
                <div class="card-body p-3"> <!-- Reduced padding -->
                    <div class="d-flex align-items-center mb-2"> <!-- Reduced margin -->
                        <div class="message-avatar bot-avatar me-2" style="width:32px;height:32px;font-size:14px;">${scientistIcon}</div>
                        <h5 class="card-title mb-0" style="font-size:1rem;">${selectedBotName}</h5>
                    </div>
                    <div class="card-text" style="font-size:0.9rem;">
                        ${renderMarkdownAndLaTeX(welcomeMessage)}
                    </div>
                </div>
            `;

                elements.chatMessages.appendChild(welcomeCard);
            }

            updateButtonStates();

            // Force scroll to bottom for welcome message
            setTimeout(() => enhancedScrollToBottom(true), 100);

            // Render KaTeX for welcome message
            renderKaTeX();
        } else {
            showToast(result.message, 'error');
        }
    } catch (error) {
        console.error('Error clearing chat:', error);
        showToast(`Error clearing chat: ${error.message}`, 'error');
    }
}

// Function to save conversation as downloadable file
async function saveConversation() {
    try {
        // Create a timestamp in YYYYMMDD_HHMMSS format
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const timestampFormat = `${year}${month}${day}_${hours}${minutes}${seconds}`;

        const defaultFilename = `plama_conversation_${timestampFormat}`;

        const filename = prompt('Enter a filename for this conversation (without extension):', defaultFilename);

        if (!filename) return;

        const botInfo = appState.availableBots[appState.selectedBot]?.display_name || "PLAMA";
        const scientistKey = appState.selectedScientist || 'none';
        const fileNameWithExt = `${filename}.txt`;

        showToast('Preparing download...', 'info');

        const response = await fetch('/api/save_conversation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                history: appState.history,
                bot_info: botInfo,
                grade: appState.grade,
                topic: appState.topic,
                scientist_key: scientistKey,
                filename: fileNameWithExt
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = fileNameWithExt;

        document.body.appendChild(downloadLink);
        downloadLink.click();

        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(url);

        showToast('Conversation downloaded successfully!', 'success');
    } catch (error) {
        console.error('Error saving conversation:', error);
        showToast(`Error saving conversation: ${error.message}`, 'error');
    }
}

// Function to upload and load conversation
async function uploadAndLoadConversation(file) {
    try {
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.txt')) {
            showToast('Please select a .txt file', 'error');
            return;
        }

        showToast('Processing conversation file...', 'info');

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload_conversation', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.status === 'success') {
            if (result.data) {
                const { history, bot_name, grade, topic, scientist_key, scientist_name } = result.data;

                // Update app state
                appState.grade = grade;
                appState.topic = topic;
                appState.history = [];

                // Set scientist if available
                if (scientist_key && scientist_key !== 'none') {
                    appState.selectedScientist = scientist_key;

                    // Load scientists data if not already loaded
                    if (!appState.availableScientists || Object.keys(appState.availableScientists).length === 0) {
                        await fetchScientists();
                    }
                } else {
                    appState.selectedScientist = 'none';
                }

                // Initialize chatbot
                await initializeChatbot();

                // Update history and redraw messages
                appState.history = history;
                elements.chatMessages.innerHTML = '';

                for (let i = 0; i < history.length; i++) {
                    const message = history[i];
                    const isUser = i % 2 === 0;
                    appendMessage(message, isUser);
                }

                updateButtonStates();
                setTimeout(() => enhancedScrollToBottom(true), 100);
                renderKaTeX();

                showToast('Conversation loaded successfully!', 'success');
            }
        } else {
            showToast(result.message, 'error');
        }
    } catch (error) {
        console.error('Error loading conversation:', error);
        showToast(`Error loading conversation: ${error.message}`, 'error');
    }
}

// ===========================================
// 7. EVENT HANDLERS & SCIENTISTS UI
// ===========================================

// Scientists UI functions
function populateScientistCards(grade = '', topic = '') {
    // Clear existing cards
    elements.scientistCards.innerHTML = '';

    if (!appState.availableScientists || Object.keys(appState.availableScientists).length === 0) {
        elements.scientistCards.innerHTML = `
        <div class="alert alert-warning">
            <i class="bi bi-exclamation-triangle"></i> No mathematicians data available. Please check your connection.
        </div>
    `;
        return;
    }

    // Create scientist cards
    Object.keys(appState.availableScientists).forEach(key => {
        const scientist = appState.availableScientists[key];

        // Skip the "none" option for the card layout but add a special card for it
        if (key === 'none') {
            const noneCard = document.createElement('div');
            noneCard.className = `scientist-card ${appState.selectedScientist === 'none' ? 'selected' : ''}`;
            noneCard.innerHTML = `
                <div class="scientist-card-header">
                    <span class="scientist-icon">${scientist.icon}</span>
                    <h5 class="scientist-name">Standard Mode</h5>
                </div>
                <div class="scientist-card-body">
                    <p class="scientist-description">Regular PLAMA teaching without any specific mathematician's style</p>
                </div>
            `;

            noneCard.addEventListener('click', () => {
                selectScientist('none');
            });

            elements.scientistCards.appendChild(noneCard);
            return;
        }

        const card = document.createElement('div');
        card.className = `scientist-card ${appState.selectedScientist === key ? 'selected' : ''}`;
        card.dataset.scientist = key;

        // Add recommendation badge if applicable
        let recommendationBadge = '';
        if (grade && topic && scientist.recommended_for_topic) {
            recommendationBadge = `
            <div class="scientist-recommendation-label" title="Recommended for this topic">
                <i class="bi bi-star-fill"></i>
            </div>
        `;
        } else if (grade && scientist.recommended_for_grade) {
            recommendationBadge = `
            <div class="scientist-recommendation-label" title="Recommended for this grade">
                <i class="bi bi-star"></i>
            </div>
        `;
        }

        card.innerHTML = `
        ${recommendationBadge}
        <div class="scientist-card-header">
            <span class="scientist-icon">${scientist.icon}</span>
            <h5 class="scientist-name">${scientist.display_name}</h5>
        </div>
        <div class="scientist-card-body">
            <p class="scientist-description">${scientist.description}</p>
            <div class="scientist-style">
                <strong>Teaching Style:</strong> ${scientist.teaching_style}
            </div>
        </div>
    `;

        card.addEventListener('click', () => {
            selectScientist(key);
        });

        elements.scientistCards.appendChild(card);
    });
}

// Select a scientist
function selectScientist(scientistKey) {
    // Update selected state in UI
    document.querySelectorAll('.scientist-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.scientist === scientistKey ||
            (scientistKey === 'none' && !card.dataset.scientist)) {
            card.classList.add('selected');
        }
    });

    // Update app state
    appState.selectedScientist = scientistKey;

    // Load detailed data when a scientist is selected
    loadScientistDetail(scientistKey);
}

// Update scientist detail with enriched data from AI
function updateScientistDetailWithEnrichedData(scientistKey, scientistData) {
    const scientistDetail = elements.scientistDetail;

    if (scientistKey === 'none' || !scientistData) {
        scientistDetail.classList.add('d-none');
        return;
    }

    // Create topic badges
    let topicBadges = '';
    if (scientistData.recommended_topics && scientistData.recommended_topics.length > 0) {
        topicBadges = scientistData.recommended_topics.map(topic =>
            `<span class="topic-badge">${topic}</span>`
        ).join(' ');
    }

    // Create key concepts badges
    let conceptBadges = '';
    if (scientistData.key_concepts && scientistData.key_concepts.length > 0) {
        conceptBadges = scientistData.key_concepts.map(concept =>
            `<span class="concept-badge">${concept}</span>`
        ).join(' ');
    }

    // Create scientist timeline
    let timelineHTML = '';
    if (scientistData.years) {
        timelineHTML = `
            <div class="scientist-timeline mb-3">
                <div class="timeline-header">
                    <i class="bi bi-clock-history me-1"></i> 
                    <span>${scientistData.years}</span>
                    <span class="ms-2">${scientistData.nationality}</span>
                </div>
                <div class="timeline-body">
                    <span class="field-badge">${scientistData.field}</span>
                </div>
            </div>
        `;
    }

    // Update UI with additional data
    scientistDetail.innerHTML = `
        <div class="d-flex align-items-center mb-3">
            <span class="scientist-icon me-2">${scientistData.icon}</span>
            <h5 class="mb-0">${scientistData.display_name}</h5>
        </div>
        ${timelineHTML}
        <p>${scientistData.description}</p>
        <p><strong>Teaching Style:</strong> ${scientistData.teaching_style}</p>
    
        <div class="scientist-concepts mb-3">
            <h6><i class="bi bi-lightbulb me-1"></i> Key Concepts:</h6>
            <div>${conceptBadges || 'No specific information'}</div>
        </div>
    
        <div class="scientist-recommended-topics">
            <h6><i class="bi bi-star-fill me-1"></i> Recommended Topics:</h6>
            <div>${topicBadges || 'No specific topic recommendations'}</div>
        </div>
    `;

    scientistDetail.classList.remove('d-none');
}

// Basic scientist detail update
function updateScientistDetail(scientistKey) {
    const scientistDetail = elements.scientistDetail;

    if (scientistKey === 'none' || !appState.availableScientists[scientistKey]) {
        scientistDetail.classList.add('d-none');
        return;
    }

    const scientist = appState.availableScientists[scientistKey];

    // Create recommended topics badges
    let topicBadges = '';
    if (scientist.recommended_topics && scientist.recommended_topics.length > 0) {
        topicBadges = scientist.recommended_topics.map(topic =>
            `<span class="topic-badge">${topic}</span>`
        ).join(' ');
    }

    scientistDetail.innerHTML = `
        <div class="d-flex align-items-center mb-3">
            <span class="scientist-icon me-2">${scientist.icon}</span>
            <h5 class="mb-0">${scientist.display_name}</h5>
        </div>
        <p>${scientist.description}</p>
        <p><strong>Teaching Style:</strong> ${scientist.teaching_style}</p>
        <div class="scientist-recommended-topics">
            <h6><i class="bi bi-star-fill me-1"></i> Recommended Topics:</h6>
            <div>${topicBadges || 'No specific topic recommendations'}</div>
        </div>
    `;

    scientistDetail.classList.remove('d-none');
}

// Populate topic options for curriculum settings
async function populateTopics(grade) {
    if (!elements.topicSelect) {
        console.warn('Topic select element not found');
        return;
    }

    try {
        const topics = await fetchCurriculum(grade);

        // Clear existing options
        elements.topicSelect.innerHTML = '';

        // Add topics
        topics.forEach(topic => {
            const option = document.createElement('option');
            option.value = topic;
            option.textContent = topic;
            elements.topicSelect.appendChild(option);
        });

        if (topics.length > 0) {
            appState.topic = topics[0];

            // Also update scientist recommendations based on new grade/topic
            fetchScientists(grade, topics[0]);
        }
    } catch (error) {
        console.error('Error populating topics:', error);
        showToast('Failed to load topics: ' + error.message, 'error');
    }
}

// Populate grade options for curriculum
function populateGradeOptions() {
    if (!elements.gradeSelect) {
        console.warn('Grade select element not found');
        return;
    }

    elements.gradeSelect.innerHTML = '';

    Object.keys(appState.availableCurriculum).forEach(grade => {
        const option = document.createElement('option');
        option.value = grade;
        option.textContent = grade;
        elements.gradeSelect.appendChild(option);
    });

    // Set initial grade
    if (elements.gradeSelect.options.length > 0) {
        appState.grade = elements.gradeSelect.options[0].value;
        populateTopics(appState.grade);
    }
}

// Populate bot options in settings
function populateBotOptions() {
    if (!elements.botOptions) {
        console.warn('Bot options element not found');
        return;
    }

    elements.botOptions.innerHTML = '';

    Object.keys(appState.availableBots).forEach((key, index) => {
        const bot = appState.availableBots[key];

        const option = document.createElement('div');
        option.className = 'form-check mb-2';

        const input = document.createElement('input');
        input.className = 'form-check-input';
        input.type = 'radio';
        input.name = 'botOption';
        input.id = `bot-${key}`;
        input.value = key;
        input.checked = key === appState.selectedBot;

        const label = document.createElement('label');
        label.className = 'form-check-label';
        label.htmlFor = `bot-${key}`;
        label.textContent = bot.display_name;

        option.appendChild(input);
        option.appendChild(label);
        elements.botOptions.appendChild(option);

        input.addEventListener('change', () => {
            if (input.checked) {
                appState.selectedBot = key;
                updateBotDescription();
            }
        });
    });

    updateBotDescription();
}

// Update bot description in settings
function updateBotDescription() {
    if (!elements.botDescription) {
        console.warn('Bot description element not found');
        return;
    }

    const selectedBot = appState.availableBots[appState.selectedBot];
    if (selectedBot) {
        elements.botDescription.innerHTML = `
            <strong>${selectedBot.display_name}</strong>
            <p class="mb-0 mt-2">${selectedBot.description}</p>
        `;

        // Disable scientist mode for PLAMA-EXAM
        if (appState.selectedBot === "plama_exam") {
            // Disable scientist tab
            const scientistTab = document.getElementById('scientist-tab');
            if (scientistTab) {
                scientistTab.classList.add('disabled');
                scientistTab.setAttribute('disabled', 'disabled');
            }

            // Reset scientist selection to none
            appState.selectedScientist = "none";

            // If scientist tab is currently active, switch to another tab
            const scientistTabPane = document.getElementById('scientist-tab-pane');
            if (scientistTabPane && scientistTabPane.classList.contains('active')) {
                // Activate curriculum tab instead
                const curriculumTab = document.getElementById('curriculum-tab');
                if (curriculumTab && typeof bootstrap !== 'undefined') {
                    bootstrap.Tab.getOrCreateInstance(curriculumTab).show();
                }
            }
        } else {
            // Enable scientist tab for other bots
            const scientistTab = document.getElementById('scientist-tab');
            if (scientistTab) {
                scientistTab.classList.remove('disabled');
                scientistTab.removeAttribute('disabled');
            }
        }
    }
}

// Message sending functions
function sendTextMessage() {
    if (!elements.messageInput) {
        console.error('Message input element not found');
        return;
    }

    const messageText = elements.messageInput.value.trim();

    // Check if there's a message or image
    if (messageText === '' && !appState.currentImageData) {
        return;
    }

    // Check if chatbot is initialized
    if (!appState.initialized) {
        showToast('Please start a conversation first', 'warning');
        return;
    }

    // Reset manual scroll flag when sending a new message
    appState.manualScrolled = false;

    // Remove scroll button if exists
    const scrollBtn = document.getElementById('scrollBottomBtn');
    if (scrollBtn) scrollBtn.remove();

    // Prepare message
    let message;

    if (appState.currentImageData) {
        // If there's an image
        message = {
            type: 'image',
            text: messageText,
            preview: appState.currentImageData.preview,
            id: appState.currentImageData.id,
            fileName: appState.currentImageData.fileName
        };

        // Clear image data
        if (elements.imagePreviewContainer) elements.imagePreviewContainer.classList.add('d-none');
        if (elements.imagePreview) {
            elements.imagePreview.src = '';
            elements.imagePreview.alt = '';
        }
        appState.currentImageData = null;
    } else {
        // If there's only text
        message = messageText;
    }

    // Add message to history
    appState.history.push(message);

    // Show message in chat - set isUser to true for user messages
    appendMessage(message, true);

    // Clear input
    elements.messageInput.value = '';
    elements.messageInput.style.height = 'auto';

    // Send message to API
    sendToAPI(message);
}

// Function to send math message
function sendMathMessage() {
    if (!elements.mathField || !elements.mathTextInput) {
        console.error('Math input elements not found');
        return;
    }

    const latexContent = elements.mathField.value.trim();
    const textMessage = elements.mathTextInput.value.trim();

    // Check if there's a formula
    if (latexContent === '') {
        showToast('Please enter a math formula', 'warning');
        return;
    }

    // Check if chatbot is initialized
    if (!appState.initialized) {
        showToast('Please start a conversation first', 'warning');
        return;
    }

    // Reset manual scroll flag when sending a new message
    appState.manualScrolled = false;

    // Remove scroll button if exists
    const scrollBtn = document.getElementById('scrollBottomBtn');
    if (scrollBtn) scrollBtn.remove();

    // Prepare message
    const message = {
        type: 'math',
        text: textMessage,
        latex: latexContent
    };

    // Add message to history
    appState.history.push(message);

    // Show message in chat - set isUser to true for user messages
    appendMessage(message, true);

    // Clear inputs
    elements.mathField.value = '';
    elements.mathTextInput.value = '';

    // Send message to API
    sendToAPI(message);
}

// Function to send message (from input) - decides which send function to use
function sendMessage() {
    if (appState.inputMode === 'text') {
        sendTextMessage();
    } else if (appState.inputMode === 'math') {
        sendMathMessage();
    }
}

// Function to set up event listeners
function setupEventListeners() {
    try {
        // Input mode toggle buttons
        if (elements.textModeBtn) {
            elements.textModeBtn.addEventListener('change', function () {
                if (this.checked) {
                    setInputMode('text');
                }
            });
        }

        if (elements.mathModeBtn) {
            elements.mathModeBtn.addEventListener('change', function () {
                if (this.checked) {
                    setInputMode('math');
                }
            });
        }

        if (elements.graphModeBtn) {
            elements.graphModeBtn.addEventListener('change', function () {
                if (this.checked) {
                    setInputMode('graph');
                }
            });
        }

        // Event listener for Geometry Mode button
        if (elements.geometryModeBtn) {
            elements.geometryModeBtn.addEventListener('change', function () {
                if (this.checked) {
                    setInputMode('geometry');
                }
            });
        }

        // Event listener for Math Canvas Mode button
        if (elements.mathCanvasBtn) {
            elements.mathCanvasBtn.addEventListener('change', function () {
                if (this.checked) {
                    setInputMode('mathcanvas');
                }
            });
        }

        // Event listener for Tiles Mode button
        if (elements.tilesModeBtn) {
            elements.tilesModeBtn.addEventListener('change', function () {
                if (this.checked) {
                    setInputMode('tiles');
                }
            });
        }

        // Event listener for 3D Calculator Mode button
        if (elements.calculator3dBtn) {
            elements.calculator3dBtn.addEventListener('change', function () {
                if (this.checked) {
                    setInputMode('calculator3d');
                }
            });
        }

        // Event listeners for 3D Calculator buttons
        if (elements.closeCalculator3dBtn) {
            elements.closeCalculator3dBtn.addEventListener('click', function () {
                if (elements.textModeBtn) {
                    elements.textModeBtn.checked = true;
                    setInputMode('text');
                }
            });
        }

        if (elements.resetCalculator3dBtn) {
            elements.resetCalculator3dBtn.addEventListener('click', resetCalculator3d);
        }

        if (elements.downloadGraph3dBtn) {
            elements.downloadGraph3dBtn.addEventListener('click', downloadGraph3d);
        }

        // 3D Calculator send button
        if (elements.calculator3dSendBtn) {
            elements.calculator3dSendBtn.addEventListener('click', function () {
                shareCalculator3d();
            });
        }

        // Add keyboard event handler for 3D calculator input
        if (elements.calculator3dTextInput) {
            elements.calculator3dTextInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    shareCalculator3d();
                    e.preventDefault();
                }
            });
        }

        // Event listeners for Math Canvas buttons
        if (elements.closeMathCanvasBtn) {
            elements.closeMathCanvasBtn.addEventListener('click', function () {
                if (elements.textModeBtn) {
                    elements.textModeBtn.checked = true;
                    setInputMode('text');
                }
            });
        }

        if (elements.resetMathCanvasBtn) {
            elements.resetMathCanvasBtn.addEventListener('click', resetMathCanvas);
        }

        if (elements.downloadMathCanvasBtn) {
            elements.downloadMathCanvasBtn.addEventListener('click', downloadMathCanvas);
        }

        // Math Canvas send button
        if (elements.mathCanvasSendBtn) {
            elements.mathCanvasSendBtn.addEventListener('click', function () {
                shareMathCanvas();
            });
        }

        // Add keyboard event handler for math canvas input
        if (elements.mathCanvasTextInput) {
            elements.mathCanvasTextInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    shareMathCanvas();
                    e.preventDefault();
                }
            });
        }

        // Calculator and Graph buttons
        if (elements.resetCalculatorBtn) {
            elements.resetCalculatorBtn.addEventListener('click', resetCalculator);
        }

        if (elements.downloadGraphBtn) {
            elements.downloadGraphBtn.addEventListener('click', downloadGraph);
        }

        // Graph input handling 
        elements.graphSendBtn = document.getElementById('graphSendBtn');
        if (elements.graphSendBtn) {
            elements.graphSendBtn.addEventListener('click', function () {
                shareGraphAsImage();
            });
        }

        // Add keyboard event handler for graph input
        if (elements.graphTextInput) {
            elements.graphTextInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' && e.ctrlKey) {
                    // Use Ctrl+Enter to add expression without sharing image
                    addExpressionToCalculator();
                    e.preventDefault();
                } else if (e.key === 'Enter' && !e.shiftKey) {
                    // Use Enter to share image to chat
                    shareGraphAsImage();
                    e.preventDefault();
                }
            });
        }

        if (elements.closeCalculatorBtn) {
            elements.closeCalculatorBtn.addEventListener('click', function () {
                if (elements.textModeBtn) {
                    elements.textModeBtn.checked = true;
                    setInputMode('text');
                }
            });
        }

        // Event listeners for Geometry
        if (elements.closeGeometryBtn) {
            elements.closeGeometryBtn.addEventListener('click', function () {
                if (elements.textModeBtn) {
                    elements.textModeBtn.checked = true;
                    setInputMode('text');
                }
            });
        }

        if (elements.setBlankGeometryBtn) {
            elements.setBlankGeometryBtn.addEventListener('click', resetGeometry);
        }

        if (elements.downloadGeometryBtn) {
            elements.downloadGeometryBtn.addEventListener('click', downloadGeometry);
        }

        // Geometry send button
        if (elements.geometrySendBtn) {
            elements.geometrySendBtn.addEventListener('click', function () {
                shareGeometry();
            });
        }

        // Add keyboard event handler for geometry input
        if (elements.geometryTextInput) {
            elements.geometryTextInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    // Use Enter to share image to chat
                    shareGeometry();
                    e.preventDefault();
                }
            });
        }

        // Event listeners for Polypad Tiles
        if (elements.closeTilesBtn) {
            elements.closeTilesBtn.addEventListener('click', function () {
                if (elements.textModeBtn) {
                    elements.textModeBtn.checked = true;
                    setInputMode('text');
                }
            });
        }

        if (elements.resetTilesBtn) {
            elements.resetTilesBtn.addEventListener('click', resetPolypad);
        }

        if (elements.downloadTilesBtn) {
            elements.downloadTilesBtn.addEventListener('click', downloadPolypadTiles);
        }

        // Tiles send button
        if (elements.tilesSendBtn) {
            elements.tilesSendBtn.addEventListener('click', function () {
                sharePolypadTiles();
            });
        }

        // Add keyboard event handler for tiles input
        if (elements.tilesTextInput) {
            elements.tilesTextInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    sharePolypadTiles();
                    e.preventDefault();
                }
            });
        }

        // Message input auto-resize
        if (elements.messageInput) {
            elements.messageInput.addEventListener('input', function () {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';

                // Reset after a delay if content is deleted
                if (this.value === '') {
                    setTimeout(() => {
                        this.style.height = 'auto';
                    }, 100);
                }
            });

            // Add Enter key support for message submission
            elements.messageInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendTextMessage();
                }
            });
        }

        // Form submission
        if (elements.chatForm) {
            elements.chatForm.addEventListener('submit', function (e) {
                e.preventDefault();
                sendMessage();
            });
        }

        // Math send button
        if (elements.mathSendBtn) {
            elements.mathSendBtn.addEventListener('click', function () {
                sendMathMessage();
            });
        }

        // New chat button
        if (elements.newChatBtn) {
            elements.newChatBtn.addEventListener('click', function () {
                if (appState.initialized && appState.history.length > 0) {
                    if (confirm('Start a new chat? Current conversation will be cleared.')) {
                        clearChat();
                    }
                } else if (elements.settingsModal) {
                    elements.settingsModal.show();
                }
            });
        }

        // Start new chat button (welcome screen)
        if (elements.startNewChatBtn) {
            elements.startNewChatBtn.addEventListener('click', function () {
                if (elements.settingsModal) {
                    elements.settingsModal.show();
                }
            });
        }

        if (elements.uploadConversationBtn && elements.conversationUpload) {
            elements.uploadConversationBtn.addEventListener('click', function () {
                elements.conversationUpload.click();
            });

            elements.conversationUpload.addEventListener('change', function (e) {
                if (this.files.length === 0) return;

                uploadAndLoadConversation(this.files[0]);

                this.value = '';
            });
        }

        // Chat messages scroll event to detect manual scrolling
        if (elements.chatMessages) {
            elements.chatMessages.addEventListener('scroll', function () {
                const isNearBottom = this.scrollHeight - this.clientHeight - this.scrollTop < 150;

                // If not near bottom and content hasn't changed recently, mark as manually scrolled
                if (!isNearBottom && (Date.now() - appState.lastContentChange) > 500) {
                    appState.manualScrolled = true;

                    // Show scroll to bottom button if we have messages and not already showing
                    if (appState.history.length > 0 && !document.getElementById('scrollBottomBtn')) {
                        addCompactScrollToBottomButton();
                    }
                } else if (isNearBottom) {
                    // If near bottom, remove scroll flag and hide scroll button
                    appState.manualScrolled = false;
                    const scrollBtn = document.getElementById('scrollBottomBtn');
                    if (scrollBtn) scrollBtn.remove();
                }
            });
        }

        // Settings form events
        if (elements.gradeSelect) {
            elements.gradeSelect.addEventListener('change', function () {
                appState.grade = this.value;
                populateTopics(appState.grade);
            });
        }

        if (elements.topicSelect) {
            elements.topicSelect.addEventListener('change', function () {
                appState.topic = this.value;
                // Update scientist recommendations when topic changes
                fetchScientists(appState.grade, this.value);
            });
        }

        if (elements.temperatureRange && elements.temperatureValue) {
            elements.temperatureRange.addEventListener('input', function () {
                appState.temperature = parseFloat(this.value);
                elements.temperatureValue.textContent = this.value;
            });
        }

        if (elements.maxTokensRange && elements.maxTokensValue) {
            elements.maxTokensRange.addEventListener('input', function () {
                appState.maxTokens = parseInt(this.value);
                elements.maxTokensValue.textContent = this.value;
            });
        }

        if (elements.applySettingsBtn) {
            elements.applySettingsBtn.addEventListener('click', function () {
                // Reset scientist selection for PLAMA-EXAM
                if (appState.selectedBot === "plama_exam") {
                    appState.selectedScientist = "none";
                }
                initializeChatbot();
            });
        }

        // Chat action buttons
        if (elements.undoBtn) {
            elements.undoBtn.addEventListener('click', undoLast);
        }

        if (elements.retryBtn) {
            elements.retryBtn.addEventListener('click', retryLast);
        }

        if (elements.clearBtn) {
            elements.clearBtn.addEventListener('click', clearChat);
        }

        if (elements.saveBtn) {
            elements.saveBtn.addEventListener('click', saveConversation);
        }

        // Image upload
        if (elements.imageUploadBtn && elements.imageUpload) {
            elements.imageUploadBtn.addEventListener('click', function () {
                elements.imageUpload.click();
            });

            elements.imageUpload.addEventListener('change', async function () {
                if (this.files.length === 0) return;

                const file = this.files[0];

                // Validate file type
                const validTypes = ['image/jpeg', 'image/png'];
                if (!validTypes.includes(file.type)) {
                    showToast('Please upload only JPEG or PNG images', 'warning');
                    this.value = '';
                    return;
                }

                // Validate file size
                if (file.size > 20 * 1024 * 1024) { // 20MB
                    showToast('File size should not exceed 20MB', 'warning');
                    this.value = '';
                    return;
                }

                // Show loading state
                if (elements.imagePreview) {
                    elements.imagePreview.src = '';
                }

                if (elements.imagePreviewContainer) {
                    elements.imagePreviewContainer.classList.remove('d-none');
                }

                if (elements.imagePreview) {
                    elements.imagePreview.alt = 'Processing image...';
                }

                try {
                    const imageData = await uploadImage(file);
                    if (imageData) {
                        // Update image preview
                        if (elements.imagePreview) {
                            elements.imagePreview.src = imageData.preview;
                            elements.imagePreview.alt = 'Image Preview';
                        }

                        // Store image data
                        appState.currentImageData = imageData;
                    } else {
                        // Hide preview on error
                        if (elements.imagePreviewContainer) {
                            elements.imagePreviewContainer.classList.add('d-none');
                        }
                    }
                } catch (error) {
                    console.error('Error processing image:', error);
                    showToast(`Error: ${error.message}`, 'error');
                    if (elements.imagePreviewContainer) {
                        elements.imagePreviewContainer.classList.add('d-none');
                    }
                }

                // Reset file input
                this.value = '';
            });
        }

        // Remove image button
        if (elements.removeImageBtn) {
            elements.removeImageBtn.addEventListener('click', function () {
                if (elements.imagePreviewContainer) {
                    elements.imagePreviewContainer.classList.add('d-none');
                }

                if (elements.imagePreview) {
                    elements.imagePreview.src = '';
                    elements.imagePreview.alt = '';
                }

                appState.currentImageData = null;
            });
        }

        // User Mode tab event listener
        const userModeTab = document.getElementById('user-mode-tab');
        if (userModeTab) {
            userModeTab.addEventListener('shown.bs.tab', function () {
                // Refresh user modes when tab is shown
                if (Object.keys(appState.availableUserModes).length === 0) {
                    fetchUserModes();
                }
            });
        }

        // Collaboration Mode tab event listener
        const collaborationTab = document.getElementById('collaboration-tab');
        if (collaborationTab) {
            collaborationTab.addEventListener('shown.bs.tab', function () {
                // Refresh collaboration data when tab is shown
                if (Object.keys(appState.availableCollaborationModes).length === 0) {
                    fetchCollaborationData();
                }
            });
        }

        console.log('Event listeners set up successfully');
    } catch (error) {
        console.error('Error setting up event listeners:', error);
        showToast('Error setting up application: ' + error.message, 'error');
    }
}

// Function to go back to assessment page
function backToAssessment() {
    if (confirm('คุณต้องการกลับไปหน้าแรกหรือไม่?\n\nการสนทนาปัจจุบันจะถูกล้าง')) {
        window.location.href = '/';
    }
}

// Make function available globally
window.backToAssessment = backToAssessment;