export const signUpTemp = (link) => {
    const currentYear = new Date().getFullYear();
    
    return `
    <!DOCTYPE html>
    <html lang="ar" dir="ltr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet">
        <title>تأكيد البريد الإلكتروني</title>
        <style>
            /* Reset and Base Styles */
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                margin: 0;
                padding: 0;
                min-height: 100vh;
                font-family: 'Tajawal', 'Cairo', sans-serif;
                direction: rtl;
                text-align: right;
            }
            
            /* Email Container */
            .email-container {
                max-width: 600px;
                margin: 40px auto;
                background: white;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                position: relative;
            }
            
            /* Header with Gradient */
            .email-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 30px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
            
            .header-pattern {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                opacity: 0.1;
                background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,0 L100,100" stroke="white" stroke-width="1"/></svg>');
            }
            
            .logo-container {
                display: inline-block;
                background: white;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            .logo-icon {
                color: #667eea;
                font-size: 36px;
                font-weight: bold;
                font-family: 'Cairo', sans-serif;
            }
            
            .header-title {
                color: white;
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 10px;
                position: relative;
                z-index: 1;
            }
            
            .header-subtitle {
                color: rgba(255, 255, 255, 0.9);
                font-size: 16px;
                font-weight: 300;
                position: relative;
                z-index: 1;
            }
            
            /* Content Area */
            .email-content {
                padding: 40px 30px;
            }
            
            .welcome-section {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .welcome-icon {
                font-size: 48px;
                margin-bottom: 20px;
                color: #667eea;
            }
            
            .greeting {
                color: #2c3e50;
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 15px;
            }
            
            .message {
                color: #5d6d7e;
                font-size: 16px;
                line-height: 1.8;
                margin-bottom: 25px;
            }
            
            .highlight-box {
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border-right: 4px solid #667eea;
                padding: 20px;
                border-radius: 10px;
                margin: 30px 0;
            }
            
            .highlight-text {
                color: #2c3e50;
                font-weight: 600;
                font-size: 18px;
                text-align: center;
            }
            
            /* CTA Button */
            .cta-container {
                text-align: center;
                margin: 40px 0;
            }
            
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white !important;
                text-decoration: none;
                padding: 18px 45px;
                font-size: 18px;
                font-weight: 600;
                border-radius: 50px;
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .cta-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 12px 30px rgba(102, 126, 234, 0.5);
            }
            
            .cta-button:active {
                transform: translateY(-1px);
            }
            
            .button-icon {
                margin-left: 10px;
                font-size: 20px;
            }
            
            /* Instructions */
            .instructions {
                background: #f8f9fa;
                border-radius: 10px;
                padding: 25px;
                margin-top: 30px;
                border: 1px solid #e9ecef;
            }
            
            .instructions-title {
                color: #2c3e50;
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .instructions-list {
                list-style: none;
                padding: 0;
            }
            
            .instructions-list li {
                padding: 10px 0;
                color: #5d6d7e;
                border-bottom: 1px solid #e9ecef;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .instructions-list li:last-child {
                border-bottom: none;
            }
            
            .list-icon {
                color: #667eea;
                font-weight: bold;
            }
            
            /* Social Media Section */
            .social-section {
                text-align: center;
                margin: 40px 0 20px;
                padding-top: 30px;
                border-top: 1px solid #e9ecef;
            }
            
            .social-title {
                color: #2c3e50;
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 20px;
            }
            
            .social-icons {
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .social-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 45px;
                height: 45px;
                border-radius: 50%;
                color: white;
                font-size: 20px;
                text-decoration: none;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            }
            
            .social-icon:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            }
            
            .social-instagram {
                background: linear-gradient(45deg, #405DE6, #E1306C, #FD1D1D, #F77737, #FCAF45);
            }
            
            .social-facebook {
                background: linear-gradient(45deg, #1877F2, #0D5AB9);
            }
            
            .social-twitter {
                background: linear-gradient(45deg, #1DA1F2, #0D8BD9);
            }
            
            .social-youtube {
                background: linear-gradient(45deg, #FF0000, #CC0000);
            }
            
            .social-linkedin {
                background: linear-gradient(45deg, #0077B5, #005582);
            }
            
            /* Contact Info */
            .contact-info {
                background: #f8f9fa;
                border-radius: 10px;
                padding: 20px;
                margin-top: 20px;
                text-align: center;
            }
            
            .contact-item {
                display: inline-block;
                margin: 0 15px;
                color: #5d6d7e;
                font-size: 14px;
                text-decoration: none;
            }
            
            .contact-item:hover {
                color: #667eea;
            }
            
            /* Footer */
            .email-footer {
                background: #2c3e50;
                color: white;
                padding: 30px;
                text-align: center;
            }
            
            .footer-links {
                margin-bottom: 20px;
            }
            
            .footer-link {
                color: rgba(255, 255, 255, 0.8);
                text-decoration: none;
                margin: 0 15px;
                font-size: 14px;
                transition: color 0.3s ease;
            }
            
            .footer-link:hover {
                color: white;
            }
            
            .copyright {
                color: rgba(255, 255, 255, 0.7);
                font-size: 13px;
                margin-top: 20px;
                line-height: 1.6;
            }
            
            .timer-warning {
                background: linear-gradient(135deg, #fff9c4 0%, #ffecb3 100%);
                border: 1px solid #ffd54f;
                border-radius: 10px;
                padding: 15px;
                margin-top: 30px;
                text-align: center;
            }
            
            .timer-text {
                color: #5d3c00;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            
            .timer-value {
                background: #ff9800;
                color: white;
                padding: 5px 12px;
                border-radius: 20px;
                font-weight: 700;
            }
            
            /* Responsive Design */
            @media (max-width: 600px) {
                .email-container {
                    margin: 20px auto;
                    border-radius: 10px;
                }
                
                .email-header {
                    padding: 30px 20px;
                }
                
                .header-title {
                    font-size: 24px;
                }
                
                .email-content {
                    padding: 30px 20px;
                }
                
                .cta-button {
                    padding: 15px 35px;
                    font-size: 16px;
                }
                
                .social-icons {
                    gap: 15px;
                }
                
                .social-icon {
                    width: 40px;
                    height: 40px;
                    font-size: 18px;
                }
                
                .contact-item {
                    display: block;
                    margin: 10px 0;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header -->
            <div class="email-header">
                <div class="header-pattern"></div>
                <div class="logo-container">
                    <div class="logo-icon">🛍️</div>
                </div>
                <h1 class="header-title">مرحباً بك في متجرنا</h1>
                <p class="header-subtitle">أكمل عملية التسجيل للوصول إلى عالم التسوق الرائع</p>
            </div>
            
            <!-- Content -->
            <div class="email-content">
                <!-- Welcome Section -->
                <div class="welcome-section">
                    <div class="welcome-icon">👋</div>
                    <h2 class="greeting">أهلاً وسهلاً بك!</h2>
                    <p class="message">
                        نشكرك على انضمامك إلى مجتمع متجرنا الإلكتروني. نحن سعداء جداً بانضمامك إلينا 
                        ونتطلع لتقديم أفضل تجربة تسوق لك.
                    </p>
                </div>
                
                <!-- Highlight Box -->
                <div class="highlight-box">
                    <p class="highlight-text">
                        ⚡ للوصول الكامل لجميع مزايا المتجر، يرجى تأكيد بريدك الإلكتروني
                    </p>
                </div>
                
                <!-- Main CTA Button -->
                <div class="cta-container">
                    <a href="${link}" class="cta-button">
                        <span class="button-icon">✅</span>
                        تأكيد البريد الإلكتروني
                    </a>
                </div>
                
                <!-- Timer Warning -->
                <div class="timer-warning">
                    <p class="timer-text">
                        <span class="timer-icon">⏳</span>
                        هذا الرابط صالح لمدة
                        <span class="timer-value">24 ساعة</span>
                        فقط
                    </p>
                </div>
                
                <!-- Instructions -->
                <div class="instructions">
                    <h3 class="instructions-title">
                        <span class="list-icon">💡</span>
                        تعليمات مهمة:
                    </h3>
                    <ul class="instructions-list">
                        <li>
                            <span class="list-icon">1.</span>
                            اضغط على زر التأكيد أعلاه
                        </li>
                        <li>
                            <span class="list-icon">2.</span>
                            ستنتقل تلقائياً إلى صفحة التأكيد
                        </li>
                        <li>
                            <span class="list-icon">3.</span>
                            يمكنك البدء بالتسوق فوراً بعد التأكيد
                        </li>
                        <li>
                            <span class="list-icon">4.</span>
                            تحقق من بريدك غير المرغوب فيه إذا لم تجد الرسالة
                        </li>
                    </ul>
                </div>
                
                <!-- Social Media -->
                <div class="social-section">
                    <h3 class="social-title">تابعنا على وسائل التواصل</h3>
                    <div class="social-icons">
                        <!-- Instagram -->
                        <a href="https://instagram.com/yourstore" class="social-icon social-instagram" target="_blank">
                            📷
                        </a>
                        <!-- Facebook -->
                        <a href="https://facebook.com/yourstore" class="social-icon social-facebook" target="_blank">
                            📘
                        </a>
                        <!-- Twitter -->
                        <a href="https://twitter.com/yourstore" class="social-icon social-twitter" target="_blank">
                            🐦
                        </a>
                        <!-- YouTube -->
                        <a href="https://youtube.com/yourstore" class="social-icon social-youtube" target="_blank">
                            ▶️
                        </a>
                        <!-- LinkedIn -->
                        <a href="https://linkedin.com/company/yourstore" class="social-icon social-linkedin" target="_blank">
                            💼
                        </a>
                    </div>
                    <p style="color: #5d6d7e; font-size: 14px;">
                        كن أول من يعرف عن عروضنا الحصرية ومنتجاتنا الجديدة
                    </p>
                </div>
                
                <!-- Contact Info -->
                <div class="contact-info">
                    <a href="mailto:support@yourstore.com" class="contact-item">
                        📧 support@yourstore.com
                    </a>
                    <a href="tel:+1234567890" class="contact-item">
                        📞 +1 234 567 890
                    </a>
                    <a href="https://yourstore.com" class="contact-item" target="_blank">
                        🌐 yourstore.com
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="email-footer">
                <div class="footer-links">
                    <a href="https://yourstore.com/privacy" class="footer-link" target="_blank">سياسة الخصوصية</a>
                    <a href="https://yourstore.com/terms" class="footer-link" target="_blank">الشروط والأحكام</a>
                    <a href="https://yourstore.com/help" class="footer-link" target="_blank">مركز المساعدة</a>
                    <a href="https://yourstore.com/contact" class="footer-link" target="_blank">اتصل بنا</a>
                </div>
                <div class="copyright">
                    <p>© ${currentYear} متجرنا الإلكتروني. جميع الحقوق محفوظة.</p>
                    <p>تم إرسال هذه الرسالة تلقائياً، يرجى عدم الرد عليها.</p>
                    <p style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
                        إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذه الرسالة بأمان.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

export const password_reset = (code) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 20px;
                background-color: #f9f9f9;
            }
            .container {
                max-width: 500px;
                margin: 0 auto;
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                color: #d32f2f;
            }
            .code-box {
                background: #f5f5f5;
                padding: 20px;
                text-align: center;
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 5px;
                margin: 25px 0;
                border-radius: 5px;
                font-family: monospace;
                border: 2px solid #ddd;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #666;
                text-align: center;
            }
            .warning {
                background: #fff8e1;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 Password Reset</h1>
            </div>
            
            <p>Hello,</p>
            
            <p>You recently requested to reset your password. Use the verification code below:</p>
            
            <div class="code-box">${code}</div>
            
            <div class="warning">
                ⚠️ <strong>This code expires in 10 minutes</strong><br>
                Do not share this code with anyone.
            </div>
            
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            
            <p>Best regards,<br>
            <strong>The Ecommerce Team</strong></p>
            
            <div class="footer">
                <p>© ${new Date().getFullYear()} Ecommerce App<br>
                This is an automated message.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

