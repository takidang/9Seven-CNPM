/* ===========================================================
 * Pharmacy Academy — Bilingual i18n system (vi / en)
 * ===========================================================
 * Usage:
 *   1. Include this script in <head>: <script src="assets/i18n.js"></script>
 *   2. Mark text:                <span data-i18n="hero.title">Tiêu đề</span>
 *   3. Mark placeholders:        <input data-i18n-attr="placeholder:input.search" />
 *   4. Mark titles/aria-labels:  <button data-i18n-attr="title:btn.zoom_in">＋</button>
 *   5. Call PA_i18n.setLang('en' | 'vi') from a UI toggle.
 * Persists choice in localStorage and broadcasts via storage event.
 * =========================================================== */

(function () {
  const STORAGE_KEY = 'pa_lang';

  const T = {
    /* ============== SHARED ============== */
    'brand.name':           { vi: 'Pharmacy Academy', en: 'Pharmacy Academy' },
    'brand.tagline':        { vi: 'Knowledge · Care · Expertise', en: 'Knowledge · Care · Expertise' },
    'btn.signin':           { vi: 'Đăng Nhập',        en: 'Sign In' },
    'btn.signup':           { vi: 'Đăng Ký',          en: 'Sign Up' },
    'btn.start':            { vi: 'Bắt Đầu Ngay',     en: 'Get Started' },
    'btn.send':             { vi: 'Gửi',              en: 'Send' },
    'btn.logout':           { vi: 'Đăng xuất',        en: 'Sign out' },

    /* ============== INDEX (homepage) ============== */
    'nav.courses':          { vi: 'Khóa học',         en: 'Courses' },
    'nav.instructors':      { vi: 'Giảng viên',       en: 'Instructors' },
    'nav.pricing':          { vi: 'Bảng giá',         en: 'Pricing' },
    'nav.chat':             { vi: 'Chat với chuyên gia', en: 'Chat with expert' },

    'hero.eyebrow':         { vi: 'Chính thức ra mắt 2026', en: 'Officially launched 2026' },
    'hero.title.line1':     { vi: 'Nền tảng đào tạo',  en: 'The platform for training' },
    'hero.title.accent':    { vi: 'dược sĩ chuẩn mực', en: 'world-class pharmacists' },
    'hero.title.line2':     { vi: 'hàng đầu',          en: '' },
    'hero.sub':             { vi: 'Học chuyên sâu về thuốc, bệnh và kỹ năng tư vấn — đồng hành cùng dược sĩ Việt Nam từ kiến thức nền tảng đến chuyên gia thực chiến.',
                              en: 'In-depth learning on drugs, diseases and counseling skills — accompanying Vietnamese pharmacists from foundational knowledge to practical expertise.' },
    'hero.tab.path':        { vi: 'Học theo lộ trình', en: 'Learn by path' },
    'hero.tab.search':      { vi: 'Tra cứu nhanh',     en: 'Quick lookup' },
    'hero.cta.view':        { vi: 'Xem khóa học',      en: 'View courses' },
    'hero.cta.start':       { vi: 'Bắt Đầu Ngay →',    en: 'Get Started →' },

    'gallery.title':        { vi: 'Đội ngũ giảng viên chuyên gia', en: 'Our expert instructors' },
    'gallery.sub':          { vi: 'Dược sĩ thực hành lâu năm tại bệnh viện, nhà thuốc và trường đại học hàng đầu.',
                              en: 'Veteran pharmacists from leading hospitals, pharmacies and universities.' },

    'featured.badge':       { vi: 'Khóa học nổi bật',  en: 'Featured course' },
    'featured.title':       { vi: 'Pharma Foundation v2 — chương trình đào tạo dược sĩ toàn diện',
                              en: 'Pharma Foundation v2 — a comprehensive pharmacist training program' },
    'featured.sub':         { vi: '120+ bài học · 30+ chuyên gia · cập nhật theo guideline 2026 — chuẩn quốc tế cho dược sĩ Việt Nam.',
                              en: '120+ lessons · 30+ experts · updated to 2026 guidelines — international standard for Vietnamese pharmacists.' },
    'featured.cta':         { vi: 'Xem giới thiệu khóa học', en: 'Watch course intro' },

    'trust.students':       { vi: 'Học viên',          en: 'Students' },
    'trust.courses':        { vi: 'Khóa học',          en: 'Courses' },
    'trust.experts':        { vi: 'Chuyên gia',        en: 'Experts' },
    'trust.satisfied':      { vi: 'Hài lòng',          en: 'Satisfied' },

    'badge.cert':           { vi: 'Chứng chỉ được công nhận', en: 'Recognized certification' },
    'badge.lifetime':       { vi: 'Truy cập trọn đời', en: 'Lifetime access' },
    'badge.guideline':      { vi: 'Cập nhật guideline mới nhất', en: 'Latest guidelines' },
    'badge.support':        { vi: 'Hỗ trợ 24/7',       en: '24/7 support' },

    'cta1.title':           { vi: 'Tạm biệt giáo trình lỗi thời và lớp học đắt đỏ.',
                              en: 'Say goodbye to outdated curricula and expensive classes.' },
    'cta1.btn':             { vi: 'Khám phá ngay',     en: 'Explore now' },
    'cta2.title':           { vi: 'Sẵn sàng nâng tầm năng lực dược sĩ của bạn?',
                              en: 'Ready to elevate your pharmacy expertise?' },

    'footer.courses':       { vi: 'Khóa học',          en: 'Courses' },
    'footer.academy':       { vi: 'Học viện',          en: 'Academy' },
    'footer.support':       { vi: 'Hỗ trợ',            en: 'Support' },
    'footer.legal':         { vi: 'Pháp lý',           en: 'Legal' },
    'footer.about':         { vi: 'Giới thiệu',        en: 'About' },
    'footer.team':          { vi: 'Đội ngũ giảng viên', en: 'Faculty' },
    'footer.partners':      { vi: 'Hợp tác',           en: 'Partnership' },
    'footer.news':          { vi: 'Tin tức',           en: 'News' },
    'footer.cert':          { vi: 'Chứng chỉ',         en: 'Certificates' },
    'footer.faq':           { vi: 'Câu hỏi thường gặp', en: 'FAQ' },
    'footer.guide':         { vi: 'Hướng dẫn học',     en: 'Learning guide' },
    'footer.contact':       { vi: 'Liên hệ',           en: 'Contact' },
    'footer.terms':         { vi: 'Điều khoản sử dụng', en: 'Terms of use' },
    'footer.privacy':       { vi: 'Chính sách bảo mật', en: 'Privacy policy' },
    'footer.refund':        { vi: 'Chính sách hoàn tiền', en: 'Refund policy' },
    'course.clinical':      { vi: 'Dược lâm sàng',     en: 'Clinical pharmacy' },
    'course.health':        { vi: 'Sức khỏe toàn diện', en: 'Holistic health' },
    'course.skin':          { vi: 'Chăm sóc da',       en: 'Skincare' },
    'course.wellness':      { vi: 'Wellness',          en: 'Wellness' },
    'course.counsel':       { vi: 'Tư vấn nhà thuốc',  en: 'Pharmacy counseling' },
    'footer.brand_desc':    { vi: 'Học viện đào tạo dược chuyên sâu — chuẩn mực, thực chiến, đồng hành trọn đời cùng dược sĩ Việt Nam.',
                              en: 'In-depth pharmacy training academy — standardized, practical, lifelong companion for Vietnamese pharmacists.' },
    'footer.copyright':     { vi: '© 2026 PHARMACY ACADEMY. All rights reserved.',
                              en: '© 2026 PHARMACY ACADEMY. All rights reserved.' },
    'footer.tagline':       { vi: 'Made with care for Vietnamese pharmacists.',
                              en: 'Made with care for Vietnamese pharmacists.' },

    /* User dropdown */
    'user.role':            { vi: 'CHUYÊN GIA',        en: 'EXPERT' },
    'user.dashboard':       { vi: 'Bảng điều khiển',   en: 'Dashboard' },
    'user.chat':            { vi: 'Cuộc trò chuyện',   en: 'Conversations' },
    'user.profile':         { vi: 'Hồ sơ cá nhân',     en: 'My profile' },
    'user.settings':        { vi: 'Cài đặt',           en: 'Settings' },

    /* ============== ADMIN LOGIN ============== */
    'login.policy_terms':   { vi: 'Chính Sách Sử Dụng', en: 'Terms of Use' },
    'login.policy_privacy': { vi: 'Chính Sách Bảo Mật', en: 'Privacy Policy' },
    'brand.stat.lessons':   { vi: 'Bài học',           en: 'Lessons' },
    'brand.stat.experts':   { vi: 'Chuyên gia',        en: 'Experts' },
    'brand.stat.students':  { vi: 'Học viên',          en: 'Students' },
    'login.partner_text':   { vi: 'Được tài trợ bởi <strong>Pharmacity</strong> và <strong>ConCung</strong>, mang chuẩn mực giáo dục dược lâm sàng đến gần hơn với người Việt Nam.',
                              en: 'Sponsored by <strong>Pharmacity</strong> and <strong>ConCung</strong>, bringing world-class clinical pharmacy education closer to the Vietnamese people.' },

    'login.welcome.line1':  { vi: 'Chào mừng',         en: 'Welcome' },
    'login.welcome.accent': { vi: 'trở lại!',          en: 'back!' },
    'login.sub':            { vi: 'Đăng nhập vào tài khoản chuyên gia để tiếp tục.',
                              en: 'Sign in to your expert account to continue.' },
    'login.label.user':     { vi: 'Tên đăng nhập',     en: 'Username' },
    'login.placeholder.user':{ vi: 'Nhập tên đăng nhập của bạn', en: 'Enter your username' },
    'login.label.pass':     { vi: 'Mật khẩu',          en: 'Password' },
    'login.placeholder.pass':{ vi: 'Nhập mật khẩu của bạn', en: 'Enter your password' },
    'login.forgot':         { vi: 'Quên mật khẩu?',    en: 'Forgot password?' },
    'login.btn':            { vi: '✦ Đăng Nhập',       en: '✦ Sign In' },
    'login.trust':          { vi: 'Được tin dùng bởi hơn', en: 'Trusted by over' },
    'login.trust_suffix':   { vi: 'dược sĩ',           en: 'pharmacists' },
    'login.divider':        { vi: 'Hoặc tiếp tục với', en: 'Or continue with' },
    'login.no_account':     { vi: 'Chưa có tài khoản chuyên gia?', en: "Don't have an expert account?" },
    'login.hint':           { vi: '💡 Demo: dùng <strong>admin</strong> / <strong>admin</strong>',
                              en: '💡 Demo: use <strong>admin</strong> / <strong>admin</strong>' },
    'login.error':          { vi: 'Sai tên đăng nhập hoặc mật khẩu', en: 'Invalid username or password' },

    /* ============== ADMIN DASHBOARD ============== */
    'admin.role':           { vi: 'CHUYÊN GIA',        en: 'EXPERT' },
    'admin.urgent':         { vi: 'chờ trả lời',       en: 'awaiting reply' },
    'admin.total':          { vi: 'cuộc trò chuyện',   en: 'conversations' },
    'admin.tab.waiting':    { vi: 'Chờ trả lời',       en: 'Awaiting' },
    'admin.tab.active':     { vi: 'Đang xử lý',        en: 'Active' },
    'admin.tab.all':        { vi: 'Tất cả',            en: 'All' },
    'admin.empty.waiting':  { vi: 'Tuyệt! Không có câu hỏi nào đang chờ.', en: 'Great! No questions waiting.' },
    'admin.empty.all':      { vi: 'Chưa có cuộc trò chuyện', en: 'No conversations yet' },
    'admin.empty.choose':   { vi: 'Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu trả lời',
                              en: 'Select a conversation from the left to start replying' },
    'admin.status.waiting': { vi: '⏳ Chờ trả lời',    en: '⏳ Awaiting' },
    'admin.status.active':  { vi: '✓ Đang xử lý',      en: '✓ Active' },
    'admin.status.bot':     { vi: '🤖 Bot xử lý',      en: '🤖 Bot handled' },
    'admin.student':        { vi: 'Học viên',          en: 'Student' },
    'admin.started':        { vi: 'Cuộc trò chuyện bắt đầu', en: 'Conversation started' },
    'admin.messages':       { vi: 'tin nhắn',          en: 'messages' },
    'admin.resolve':        { vi: '✓ Đánh dấu xong',   en: '✓ Mark resolved' },
    'admin.resolved_msg':   { vi: 'Cuộc trò chuyện đã được chuyên gia đánh dấu hoàn thành.',
                              en: 'This conversation has been marked as resolved by the expert.' },

    'admin.template.greet':       { vi: '👋 Chào hỏi', en: '👋 Greeting' },
    'admin.template.greet_text':  { vi: 'Cảm ơn bạn đã liên hệ. Tôi sẽ giúp bạn về vấn đề này.',
                                    en: 'Thank you for reaching out. I will help you with this issue.' },
    'admin.template.refer':       { vi: '🏥 Đề nghị khám', en: '🏥 Refer to clinic' },
    'admin.template.refer_text':  { vi: 'Trường hợp này bạn nên đến cơ sở y tế gần nhất để được khám trực tiếp. Trong khi chờ, ',
                                    en: 'For this case, please visit the nearest medical facility for direct examination. In the meantime, ' },
    'admin.template.cite':        { vi: '📚 Trích Dược thư', en: '📚 Cite Pharmacopoeia' },
    'admin.template.cite_text':   { vi: 'Theo Dược thư Quốc gia Việt Nam, ',
                                    en: 'According to the Vietnam National Pharmacopoeia, ' },
    'admin.template.disclaimer':  { vi: '⚠️ Disclaimer', en: '⚠️ Disclaimer' },
    'admin.template.disclaimer_text':{ vi: 'Lưu ý: thông tin trên chỉ tham khảo, không thay thế đơn của bác sĩ.',
                                       en: 'Note: this information is for reference only and does not replace a doctor’s prescription.' },
    'admin.reply.placeholder':    { vi: 'Nhập câu trả lời chuyên môn...', en: 'Type your expert reply...' },

    /* Time ago */
    'time.now':             { vi: 'vừa xong',          en: 'just now' },
    'time.minutes':         { vi: 'phút trước',        en: 'min ago' },
    'time.hours':           { vi: 'giờ trước',         en: 'hrs ago' },
    'time.days':            { vi: 'ngày trước',        en: 'days ago' },

    /* PDF viewer */
    'pdf.meta':             { vi: 'Pharmacy Academy · Cập nhật 02/05/2026',
                              en: 'Pharmacy Academy · Updated 02/05/2026' },
    'pdf.zoom_in':          { vi: 'Phóng to',          en: 'Zoom in' },
    'pdf.zoom_out':         { vi: 'Thu nhỏ',           en: 'Zoom out' },
    'pdf.print':            { vi: 'In tài liệu',       en: 'Print' },
    'pdf.download':         { vi: 'Tải xuống',         en: 'Download' },
    'pdf.close':            { vi: 'Đóng',              en: 'Close' },

    /* ============== CHAT (user) ============== */
    'chat.new':             { vi: '＋ Cuộc trò chuyện mới', en: '＋ New conversation' },
    'chat.history':         { vi: 'Lịch sử',           en: 'History' },
    'chat.empty':           { vi: 'Chưa có cuộc trò chuyện nào. Hỏi câu đầu tiên để bắt đầu!',
                              en: 'No conversations yet. Ask your first question to get started!' },
    'chat.user.role':       { vi: 'Học viên · Free',   en: 'Student · Free' },
    'chat.agent.name':      { vi: 'Trợ lý chuyên gia Dược', en: 'Pharmacy Expert Assistant' },
    'chat.agent.status':    { vi: '● Đang hoạt động · Phản hồi trong vài giây',
                              en: '● Online · Replies within seconds' },
    'chat.disclaimer':      { vi: 'Thông tin từ trợ lý chỉ mang tính tham khảo, không thay thế chẩn đoán và tư vấn của bác sĩ/dược sĩ. Trong trường hợp khẩn cấp, vui lòng liên hệ cơ sở y tế gần nhất.',
                              en: 'Information from the assistant is for reference only and does not replace diagnosis or advice from a doctor/pharmacist. In emergencies, contact the nearest medical facility.' },
    'chat.welcome.line1':   { vi: 'Xin chào! Tôi là',  en: 'Hi there! I am' },
    'chat.welcome.accent':  { vi: 'Trợ lý chuyên gia Dược', en: 'the Pharmacy Expert Assistant' },
    'chat.welcome.sub':     { vi: 'Hỏi tôi bất cứ điều gì về thuốc, bệnh lý, tương tác thuốc, hoặc tư vấn nhà thuốc.',
                              en: 'Ask me anything about drugs, diseases, drug interactions, or pharmacy counseling.' },
    'chat.suggest.cat1':    { vi: '💊 Tra cứu thuốc',  en: '💊 Drug lookup' },
    'chat.suggest.text1':   { vi: 'Cho tôi biết về paracetamol — liều dùng, chống chỉ định, tác dụng phụ',
                              en: 'Tell me about paracetamol — dosage, contraindications, side effects' },
    'chat.suggest.cat2':    { vi: '🩺 Triệu chứng',    en: '🩺 Symptoms' },
    'chat.suggest.text2':   { vi: 'Bệnh nhân ho khan kéo dài 3 tuần — tôi nên tư vấn gì tại nhà thuốc?',
                              en: 'A patient has had a dry cough for 3 weeks — what advice should I give at the pharmacy?' },
    'chat.suggest.cat3':    { vi: '⚠️ Tương tác',      en: '⚠️ Interactions' },
    'chat.suggest.text3':   { vi: 'Warfarin có tương tác nguy hiểm với những thuốc nào?',
                              en: 'What dangerous drug interactions does warfarin have?' },
    'chat.suggest.cat4':    { vi: '📚 Học liệu',       en: '📚 Learning' },
    'chat.suggest.text4':   { vi: 'Tóm tắt nhóm thuốc kháng histamin H1 — phân loại và cách chọn',
                              en: 'Summarize H1 antihistamines — classification and how to choose' },
    'chat.input.placeholder':{ vi: 'Hỏi về thuốc, bệnh, tương tác...', en: 'Ask about drugs, diseases, interactions...' },
    'chat.input.foot':      { vi: 'Trợ lý có thể mắc lỗi · Luôn xác minh thông tin quan trọng với chuyên gia',
                              en: 'The assistant may make mistakes · Always verify important info with an expert' },

    /* Lang switcher */
    'lang.vie':             { vi: 'Tiếng Việt',        en: 'Vietnamese' },
    'lang.eng':             { vi: 'English',           en: 'English' },

    /* ============== PROFILE PAGE ============== */
    'profile.back':         { vi: 'Trang chủ',         en: 'Home' },
    'profile.title':        { vi: 'Hồ sơ cá nhân',     en: 'My Profile' },
    'profile.sub':          { vi: 'Quản lý thông tin cá nhân và hồ sơ chuyên môn của bạn.',
                              en: 'Manage your personal information and professional profile.' },
    'profile.tab.overview': { vi: 'Tổng quan',         en: 'Overview' },
    'profile.tab.expertise':{ vi: 'Chuyên môn',        en: 'Expertise' },
    'profile.tab.activity': { vi: 'Hoạt động',         en: 'Activity' },

    'profile.section.basic':{ vi: 'Thông tin cơ bản',  en: 'Basic information' },
    'profile.section.basic.sub':{ vi: 'Cập nhật danh tính và thông tin liên hệ',
                                  en: 'Update your identity and contact details' },
    'profile.section.work': { vi: 'Thông tin nghề nghiệp', en: 'Professional information' },
    'profile.section.work.sub':{ vi: 'Bằng cấp, chứng chỉ và nơi công tác',
                                 en: 'Credentials, certificates and workplace' },
    'profile.section.bio':  { vi: 'Giới thiệu bản thân', en: 'About me' },
    'profile.section.bio.sub':{ vi: 'Một đoạn ngắn giúp học viên hiểu hơn về bạn',
                                en: 'A short paragraph to introduce yourself to students' },
    'profile.section.social':{ vi: 'Liên kết mạng xã hội', en: 'Social links' },
    'profile.section.social.sub':{ vi: 'Tài khoản công khai để học viên kết nối',
                                   en: 'Public accounts where students can connect' },

    'profile.field.fullname':{ vi: 'Họ và tên',        en: 'Full name' },
    'profile.field.email':  { vi: 'Email',             en: 'Email' },
    'profile.field.phone':  { vi: 'Số điện thoại',     en: 'Phone number' },
    'profile.field.dob':    { vi: 'Ngày sinh',         en: 'Date of birth' },
    'profile.field.gender': { vi: 'Giới tính',         en: 'Gender' },
    'profile.field.address':{ vi: 'Địa chỉ',           en: 'Address' },
    'profile.field.license':{ vi: 'Số chứng chỉ hành nghề', en: 'Professional license number' },
    'profile.field.specialty':{ vi: 'Chuyên khoa',     en: 'Specialty' },
    'profile.field.years':  { vi: 'Năm kinh nghiệm',   en: 'Years of experience' },
    'profile.field.workplace':{ vi: 'Nơi công tác',    en: 'Workplace' },
    'profile.field.bio':    { vi: 'Tiểu sử',           en: 'Bio' },
    'profile.bio.placeholder':{ vi: 'Chia sẻ về kinh nghiệm, chuyên môn và đam mê của bạn...',
                                en: 'Share your experience, expertise and passion...' },

    'profile.gender.male':  { vi: 'Nam',               en: 'Male' },
    'profile.gender.female':{ vi: 'Nữ',                en: 'Female' },
    'profile.gender.other': { vi: 'Khác',              en: 'Other' },

    'profile.upload':       { vi: 'Đổi ảnh đại diện',  en: 'Change photo' },
    'profile.remove_avatar':{ vi: 'Xóa ảnh',           en: 'Remove photo' },
    'profile.role.short':   { vi: 'Chuyên gia',        en: 'Expert' },
    'profile.verified':     { vi: '✓ Đã xác thực',     en: '✓ Verified' },

    'profile.save':         { vi: 'Lưu thay đổi',      en: 'Save changes' },
    'profile.cancel':       { vi: 'Hủy',               en: 'Cancel' },
    'profile.saved':        { vi: '✓ Đã lưu thay đổi', en: '✓ Changes saved' },

    /* ============== SETTINGS PAGE ============== */
    'settings.title':       { vi: 'Cài đặt',           en: 'Settings' },
    'settings.sub':         { vi: 'Tùy chỉnh tài khoản, thông báo và quyền riêng tư của bạn.',
                              en: 'Customize your account, notifications and privacy.' },

    'settings.menu.account':  { vi: 'Tài khoản',       en: 'Account' },
    'settings.menu.security': { vi: 'Bảo mật',         en: 'Security' },
    'settings.menu.notif':    { vi: 'Thông báo',       en: 'Notifications' },
    'settings.menu.appear':   { vi: 'Giao diện',       en: 'Appearance' },
    'settings.menu.language': { vi: 'Ngôn ngữ',        en: 'Language' },
    'settings.menu.privacy':  { vi: 'Quyền riêng tư',  en: 'Privacy' },

    /* Account */
    'settings.account.title':   { vi: 'Tài khoản đăng nhập', en: 'Login account' },
    'settings.account.username':{ vi: 'Tên người dùng', en: 'Username' },
    'settings.account.email':   { vi: 'Địa chỉ email',  en: 'Email address' },
    'settings.account.email.note':{ vi: 'Email được dùng để đăng nhập và nhận thông báo quan trọng.',
                                    en: 'Used for sign-in and important notifications.' },
    'settings.account.delete':  { vi: 'Vùng nguy hiểm', en: 'Danger zone' },
    'settings.account.delete.sub':{ vi: 'Xóa tài khoản sẽ xóa vĩnh viễn toàn bộ dữ liệu của bạn. Hành động này không thể hoàn tác.',
                                    en: 'Deleting your account permanently removes all your data. This action cannot be undone.' },
    'settings.account.delete.btn':{ vi: 'Xóa tài khoản của tôi', en: 'Delete my account' },

    /* Security */
    'settings.security.password':   { vi: 'Đổi mật khẩu', en: 'Change password' },
    'settings.security.current':    { vi: 'Mật khẩu hiện tại', en: 'Current password' },
    'settings.security.new':        { vi: 'Mật khẩu mới', en: 'New password' },
    'settings.security.confirm':    { vi: 'Xác nhận mật khẩu mới', en: 'Confirm new password' },
    'settings.security.update':     { vi: 'Cập nhật mật khẩu', en: 'Update password' },
    'settings.security.2fa':        { vi: 'Xác thực 2 yếu tố (2FA)', en: 'Two-factor authentication (2FA)' },
    'settings.security.2fa.sub':    { vi: 'Tăng cường bảo mật bằng mã OTP gửi đến điện thoại của bạn mỗi lần đăng nhập.',
                                      en: 'Add an extra layer with OTP codes sent to your phone on every sign-in.' },
    'settings.security.sessions':   { vi: 'Phiên đăng nhập', en: 'Active sessions' },
    'settings.security.sessions.sub':{ vi: 'Các thiết bị đang đăng nhập vào tài khoản của bạn',
                                       en: 'Devices currently signed into your account' },
    'settings.security.signout_all':{ vi: 'Đăng xuất khỏi tất cả thiết bị', en: 'Sign out from all devices' },

    /* Notifications */
    'settings.notif.title':         { vi: 'Tùy chọn thông báo', en: 'Notification preferences' },
    'settings.notif.email':         { vi: 'Email', en: 'Email' },
    'settings.notif.push':          { vi: 'Thông báo đẩy', en: 'Push notifications' },
    'settings.notif.sms':           { vi: 'Tin nhắn SMS', en: 'SMS' },
    'settings.notif.new_question':  { vi: 'Câu hỏi mới từ học viên', en: 'New questions from students' },
    'settings.notif.new_question.sub':{ vi: 'Nhận thông báo khi có học viên cần tư vấn',
                                        en: 'Get notified when a student needs guidance' },
    'settings.notif.weekly':        { vi: 'Báo cáo hoạt động hàng tuần', en: 'Weekly activity report' },
    'settings.notif.weekly.sub':    { vi: 'Tổng kết câu hỏi đã trả lời, đánh giá học viên',
                                      en: 'Summary of answered questions and student ratings' },
    'settings.notif.product':       { vi: 'Cập nhật sản phẩm', en: 'Product updates' },
    'settings.notif.product.sub':   { vi: 'Tính năng mới và thông báo từ Pharmacy Academy',
                                      en: 'New features and announcements from Pharmacy Academy' },
    'settings.notif.marketing':     { vi: 'Tin marketing & khuyến mãi', en: 'Marketing & promotions' },
    'settings.notif.marketing.sub': { vi: 'Khóa học mới, ưu đãi và sự kiện',
                                      en: 'New courses, deals and events' },

    /* Appearance */
    'settings.appear.title':        { vi: 'Tùy chỉnh giao diện', en: 'Customize appearance' },
    'settings.appear.theme':        { vi: 'Chủ đề', en: 'Theme' },
    'settings.appear.theme.sub':    { vi: 'Chọn giao diện sáng, tối hoặc theo hệ thống',
                                      en: 'Choose light, dark, or system theme' },
    'settings.appear.theme.light':  { vi: 'Sáng', en: 'Light' },
    'settings.appear.theme.dark':   { vi: 'Tối', en: 'Dark' },
    'settings.appear.theme.system': { vi: 'Theo hệ thống', en: 'System' },
    'settings.appear.density':      { vi: 'Mật độ giao diện', en: 'Interface density' },
    'settings.appear.density.cozy': { vi: 'Thoáng', en: 'Cozy' },
    'settings.appear.density.compact':{ vi: 'Gọn', en: 'Compact' },

    /* Language */
    'settings.language.title':      { vi: 'Ngôn ngữ hiển thị', en: 'Display language' },
    'settings.language.sub':        { vi: 'Áp dụng cho toàn bộ giao diện trên tất cả thiết bị.',
                                      en: 'Applies to the entire interface on all devices.' },

    /* Privacy */
    'settings.privacy.title':       { vi: 'Quyền riêng tư', en: 'Privacy controls' },
    'settings.privacy.profile_pub': { vi: 'Hiển thị hồ sơ công khai', en: 'Public profile' },
    'settings.privacy.profile_pub.sub':{ vi: 'Cho phép học viên xem hồ sơ và chuyên môn của bạn',
                                         en: 'Let students view your profile and expertise' },
    'settings.privacy.activity':    { vi: 'Hiển thị trạng thái hoạt động', en: 'Show activity status' },
    'settings.privacy.activity.sub':{ vi: 'Học viên thấy bạn đang online hay offline',
                                      en: 'Students can see when you are online or offline' },
    'settings.privacy.data':        { vi: 'Dữ liệu cá nhân', en: 'Personal data' },
    'settings.privacy.export':      { vi: 'Tải xuống dữ liệu của tôi', en: 'Download my data' },
    'settings.privacy.export.sub':  { vi: 'Tải về toàn bộ thông tin tài khoản dạng JSON',
                                      en: 'Download your entire account data as JSON' },

    'settings.section.note':        { vi: 'Cài đặt được lưu tự động', en: 'Settings are saved automatically' },
  };

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || 'vi';
  }

  function tr(key) {
    const lang = getLang();
    const entry = T[key];
    if (!entry) return key;
    return entry[lang] ?? entry.vi ?? key;
  }

  function applyTranslations(root = document) {
    /* Plain text content */
    root.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = tr(key);
      /* Allow basic HTML in translation strings (for <strong>, etc.) */
      if (val.includes('<')) el.innerHTML = val;
      else el.textContent = val;
    });

    /* Attribute translations: data-i18n-attr="placeholder:key, title:key2" */
    root.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const spec = el.getAttribute('data-i18n-attr');
      spec.split(',').forEach(pair => {
        const [attr, key] = pair.trim().split(':');
        if (attr && key) el.setAttribute(attr, tr(key));
      });
    });

    /* Update <html lang="..."> */
    document.documentElement.lang = getLang();
  }

  function setLang(lang) {
    if (lang !== 'vi' && lang !== 'en') return;
    localStorage.setItem(STORAGE_KEY, lang);
    applyTranslations();
    /* Custom event so pages can re-render dynamic content (e.g., chat history) */
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  /* Cross-tab sync */
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      applyTranslations();
      window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: getLang() } }));
    }
  });

  /* Apply on load */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => applyTranslations());
  } else {
    applyTranslations();
  }

  /* Public API */
  window.PA_i18n = { tr, setLang, getLang, applyTranslations };
})();
