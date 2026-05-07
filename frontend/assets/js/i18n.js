/* ===========================================================
 * FFC — Bilingual i18n system (vi / en)
 * ===========================================================
 * Hệ thống quản lý tổng thể cho cửa hàng sửa chữa
 * điện thoại & máy tính.
 * -----------------------------------------------------------
 * Usage:
 *   1. Include this script in <head>: <script src="assets/js/i18n.js"></script>
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
    'brand.name':           { vi: 'FFC',           en: 'FFC' },
    'brand.tagline':        { vi: 'Sửa Nhanh · Bảo Hành · Uy Tín', en: 'Fast · Warranted · Trusted' },
    'btn.signin':           { vi: 'Đăng Nhập',          en: 'Sign In' },
    'btn.signup':           { vi: 'Đăng Ký',            en: 'Sign Up' },
    'btn.start':            { vi: 'Đặt Lịch Ngay',      en: 'Book Now' },
    'btn.send':             { vi: 'Gửi',                en: 'Send' },
    'btn.logout':           { vi: 'Đăng xuất',          en: 'Sign out' },

    /* ============== INDEX (homepage) ============== */
    'nav.home':             { vi: 'Trang chủ',          en: 'Home' },
    'nav.laptop':           { vi: 'Sửa Laptop',         en: 'Laptop Repair' },
    'nav.mac':              { vi: 'Sửa Mac',            en: 'Mac Repair' },
    'nav.phone':            { vi: 'Sửa điện thoại',     en: 'Phone Repair' },
    'nav.courses':          { vi: 'Dịch vụ',            en: 'Services' },
    'nav.shop':             { vi: 'Cửa hàng',           en: 'Store' },
    'nav.instructors':      { vi: 'Kỹ thuật viên',      en: 'Technicians' },
    'nav.pricing':          { vi: 'Bảng giá',           en: 'Pricing' },
    'nav.pricing_full':     { vi: 'Bảng giá dịch vụ',   en: 'Service Pricing' },
    'nav.training':         { vi: 'Dạy nghề',           en: 'Training' },
    'nav.buildpc':          { vi: 'Build PC',           en: 'Build PC' },
    'nav.blog':             { vi: 'Blog',               en: 'Blog' },
    'nav.contact':          { vi: 'Liên hệ',            en: 'Contact' },
    'nav.chat':             { vi: 'Chat với kỹ thuật viên', en: 'Chat with technician' },
    'header.search':        { vi: 'Tìm kiếm',           en: 'Search' },

    'hero.eyebrow':         { vi: 'Hoạt động chính thức 2026', en: 'Officially launched 2026' },
    'hero.title.line1':     { vi: 'Trung tâm sửa chữa', en: 'The repair center for' },
    'hero.title.accent':    { vi: 'điện thoại & laptop', en: 'phones & laptops' },
    'hero.title.line2':     { vi: 'uy tín',             en: 'you can trust' },
    'hero.sub':             { vi: 'Sửa chữa nhanh — chẩn đoán miễn phí — bảo hành rõ ràng. Đồng hành cùng khách hàng từ máy hư nhẹ đến lỗi phần cứng phức tạp.',
                              en: 'Fast repairs — free diagnostics — clear warranty. Standing by our customers from minor faults to complex hardware issues.' },
    'hero.tab.path':        { vi: 'Đặt lịch sửa',       en: 'Book a repair' },
    'hero.tab.search':      { vi: 'Tra cứu báo giá',    en: 'Quick quote' },
    'hero.cta.view':        { vi: 'Xem dịch vụ',        en: 'View services' },
    'hero.cta.start':       { vi: 'Đặt Lịch Ngay →',    en: 'Book Now →' },

    'gallery.title':        { vi: 'Đội ngũ kỹ thuật viên giàu kinh nghiệm', en: 'Our experienced technicians' },
    'gallery.sub':          { vi: 'Kỹ thuật viên đã qua đào tạo, từng làm việc tại các trung tâm bảo hành uỷ quyền lớn.',
                              en: 'Trained technicians with backgrounds in major authorized service centers.' },

    'featured.badge':       { vi: 'Dịch vụ nổi bật',    en: 'Featured service' },
    'featured.title':       { vi: 'Combo Sửa Chữa Toàn Diện — kiểm tra · sửa · bảo hành',
                              en: 'Complete Repair Combo — diagnose · fix · warranty' },
    'featured.sub':         { vi: '500+ ca sửa thành công · 20+ kỹ thuật viên · linh kiện chính hãng — chuẩn dịch vụ cao cấp.',
                              en: '500+ successful repairs · 20+ technicians · genuine parts — premium service standard.' },
    'featured.cta':         { vi: 'Xem chi tiết dịch vụ', en: 'See service details' },

    'trust.students':       { vi: 'Khách hàng',         en: 'Customers' },
    'trust.courses':        { vi: 'Đơn sửa',            en: 'Repairs' },
    'trust.experts':        { vi: 'Kỹ thuật viên',      en: 'Technicians' },
    'trust.satisfied':      { vi: 'Hài lòng',           en: 'Satisfied' },

    'badge.cert':           { vi: 'Bảo hành chính hãng', en: 'Genuine warranty' },
    'badge.lifetime':       { vi: 'Bảo hành dài hạn',   en: 'Long-term warranty' },
    'badge.guideline':      { vi: 'Linh kiện chính hãng', en: 'Genuine parts' },
    'badge.support':        { vi: 'Hỗ trợ 24/7',        en: '24/7 support' },

    'cta1.title':           { vi: 'Đừng để máy hỏng làm gián đoạn công việc của bạn.',
                              en: 'Don’t let a broken device disrupt your work.' },
    'cta1.btn':             { vi: 'Đặt lịch ngay',      en: 'Book now' },
    'cta2.title':           { vi: 'Sẵn sàng để máy của bạn được chăm sóc đúng cách?',
                              en: 'Ready to get your device properly serviced?' },

    'footer.courses':       { vi: 'Dịch vụ',            en: 'Services' },
    'footer.academy':       { vi: 'Trung tâm',          en: 'Center' },
    'footer.support':       { vi: 'Hỗ trợ',             en: 'Support' },
    'footer.legal':         { vi: 'Pháp lý',            en: 'Legal' },
    'footer.about':         { vi: 'Giới thiệu',         en: 'About' },
    'footer.team':          { vi: 'Đội ngũ kỹ thuật viên', en: 'Technicians' },
    'footer.partners':      { vi: 'Hợp tác',            en: 'Partnership' },
    'footer.news':          { vi: 'Tin tức',            en: 'News' },
    'footer.cert':          { vi: 'Chứng nhận',         en: 'Certificates' },
    'footer.faq':           { vi: 'Câu hỏi thường gặp', en: 'FAQ' },
    'footer.guide':         { vi: 'Hướng dẫn bảo quản', en: 'Care guide' },
    'footer.contact':       { vi: 'Liên hệ',            en: 'Contact' },
    'footer.terms':         { vi: 'Điều khoản sử dụng', en: 'Terms of use' },
    'footer.privacy':       { vi: 'Chính sách bảo mật', en: 'Privacy policy' },
    'footer.refund':        { vi: 'Chính sách hoàn tiền', en: 'Refund policy' },
    'course.clinical':      { vi: 'Sửa điện thoại',     en: 'Phone repair' },
    'course.health':        { vi: 'Sửa laptop',         en: 'Laptop repair' },
    'course.skin':          { vi: 'Thay màn hình',      en: 'Screen replacement' },
    'course.wellness':      { vi: 'Thay pin',           en: 'Battery replacement' },
    'course.counsel':       { vi: 'Vệ sinh & nâng cấp', en: 'Cleaning & upgrade' },
    'footer.brand_desc':    { vi: 'Trung tâm sửa chữa điện thoại & máy tính — minh bạch báo giá, bảo hành rõ ràng, đồng hành dài lâu cùng khách hàng.',
                              en: 'Phone & computer repair center — transparent quotes, clear warranty, a long-term partner for our customers.' },
    'footer.copyright':     { vi: '© 2026 FFC. All rights reserved.',
                              en: '© 2026 FFC. All rights reserved.' },
    'footer.tagline':       { vi: 'Dịch vụ tận tâm — sửa chữa tại Việt Nam.',
                              en: 'Made with care for our customers in Vietnam.' },

    /* User dropdown */
    'user.role':            { vi: 'KỸ THUẬT VIÊN',      en: 'TECHNICIAN' },
    'user.dashboard':       { vi: 'Bảng điều khiển',    en: 'Dashboard' },
    'user.chat':            { vi: 'Cuộc trò chuyện',    en: 'Conversations' },
    'user.profile':         { vi: 'Hồ sơ cá nhân',      en: 'My profile' },
    'user.settings':        { vi: 'Cài đặt',            en: 'Settings' },

    /* ============== ADMIN LOGIN ============== */
    'login.policy_terms':   { vi: 'Chính Sách Sử Dụng', en: 'Terms of Use' },
    'login.policy_privacy': { vi: 'Chính Sách Bảo Mật', en: 'Privacy Policy' },
    'brand.stat.lessons':   { vi: 'Ca sửa',             en: 'Repairs' },
    'brand.stat.experts':   { vi: 'Kỹ thuật viên',      en: 'Technicians' },
    'brand.stat.students':  { vi: 'Khách hàng',         en: 'Customers' },
    'login.partner_text':   { vi: 'Hợp tác với các nhà cung cấp linh kiện <strong>chính hãng</strong>, mang dịch vụ sửa chữa <strong>uy tín</strong> đến gần hơn với khách hàng Việt Nam.',
                              en: 'Working with <strong>genuine</strong> parts suppliers to bring <strong>trusted</strong> repair services closer to customers in Vietnam.' },

    'login.welcome.line1':  { vi: 'Chào mừng',          en: 'Welcome' },
    'login.welcome.accent': { vi: 'trở lại!',           en: 'back!' },
    'login.sub':            { vi: 'Đăng nhập vào tài khoản kỹ thuật viên để tiếp tục.',
                              en: 'Sign in to your technician account to continue.' },
    'login.label.user':     { vi: 'Tên đăng nhập',      en: 'Username' },
    'login.placeholder.user':{ vi: 'Nhập tên đăng nhập của bạn', en: 'Enter your username' },
    'login.label.pass':     { vi: 'Mật khẩu',           en: 'Password' },
    'login.placeholder.pass':{ vi: 'Nhập mật khẩu của bạn', en: 'Enter your password' },
    'login.forgot':         { vi: 'Quên mật khẩu?',     en: 'Forgot password?' },
    'login.btn':            { vi: '✦ Đăng Nhập',        en: '✦ Sign In' },
    'login.trust':          { vi: 'Được tin dùng bởi hơn', en: 'Trusted by over' },
    'login.trust_suffix':   { vi: 'khách hàng',         en: 'customers' },
    'login.divider':        { vi: 'Hoặc tiếp tục với',  en: 'Or continue with' },
    'login.no_account':     { vi: 'Chưa có tài khoản kỹ thuật viên?', en: "Don't have a technician account?" },
    'login.hint':           { vi: '💡 Demo: dùng <strong>admin</strong> / <strong>admin</strong>',
                              en: '💡 Demo: use <strong>admin</strong> / <strong>admin</strong>' },
    'login.error':          { vi: 'Sai tên đăng nhập hoặc mật khẩu', en: 'Invalid username or password' },

    /* ============== ADMIN DASHBOARD ============== */
    'admin.role':           { vi: 'KỸ THUẬT VIÊN',      en: 'TECHNICIAN' },
    'admin.urgent':         { vi: 'chờ xử lý',          en: 'awaiting' },
    'admin.total':          { vi: 'cuộc trò chuyện',    en: 'conversations' },
    'admin.tab.waiting':    { vi: 'Chờ xử lý',          en: 'Awaiting' },
    'admin.tab.active':     { vi: 'Đang xử lý',         en: 'Active' },
    'admin.tab.all':        { vi: 'Tất cả',             en: 'All' },
    'admin.empty.waiting':  { vi: 'Tuyệt! Không có yêu cầu nào đang chờ.', en: 'Great! No requests waiting.' },
    'admin.empty.all':      { vi: 'Chưa có cuộc trò chuyện', en: 'No conversations yet' },
    'admin.empty.choose':   { vi: 'Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu trả lời',
                              en: 'Select a conversation from the left to start replying' },
    'admin.status.waiting': { vi: '⏳ Chờ xử lý',       en: '⏳ Awaiting' },
    'admin.status.active':  { vi: '✓ Đang xử lý',       en: '✓ Active' },
    'admin.status.bot':     { vi: '🤖 Bot xử lý',       en: '🤖 Bot handled' },
    'admin.student':        { vi: 'Khách hàng',         en: 'Customer' },
    'admin.started':        { vi: 'Cuộc trò chuyện bắt đầu', en: 'Conversation started' },
    'admin.messages':       { vi: 'tin nhắn',           en: 'messages' },
    'admin.resolve':        { vi: '✓ Đánh dấu xong',    en: '✓ Mark resolved' },
    'admin.resolved_msg':   { vi: 'Cuộc trò chuyện đã được kỹ thuật viên đánh dấu hoàn thành.',
                              en: 'This conversation has been marked as resolved by the technician.' },

    'admin.template.greet':       { vi: '👋 Chào hỏi', en: '👋 Greeting' },
    'admin.template.greet_text':  { vi: 'Cảm ơn bạn đã liên hệ FFC. Tôi sẽ hỗ trợ bạn về vấn đề này.',
                                    en: 'Thank you for contacting FFC. I will help you with this issue.' },
    'admin.template.refer':       { vi: '🏪 Mang ra cửa hàng', en: '🏪 Bring to shop' },
    'admin.template.refer_text':  { vi: 'Trường hợp này bạn nên mang máy đến chi nhánh gần nhất để kỹ thuật viên kiểm tra trực tiếp. Trong khi chờ, ',
                                    en: 'For this case, please bring your device to the nearest branch so a technician can inspect it. In the meantime, ' },
    'admin.template.cite':        { vi: '📋 Báo giá tham khảo', en: '📋 Reference quote' },
    'admin.template.cite_text':   { vi: 'Theo bảng giá tham khảo của FFC, ',
                                    en: 'According to FFC’s reference price list, ' },
    'admin.template.disclaimer':  { vi: '⚠️ Lưu ý',     en: '⚠️ Disclaimer' },
    'admin.template.disclaimer_text':{ vi: 'Lưu ý: báo giá có thể thay đổi sau khi kỹ thuật viên kiểm tra trực tiếp tại cửa hàng.',
                                       en: 'Note: the final quote may change after on-site inspection by a technician.' },
    'admin.reply.placeholder':    { vi: 'Nhập phản hồi cho khách hàng...', en: 'Type your reply to the customer...' },

    /* Time ago */
    'time.now':             { vi: 'vừa xong',           en: 'just now' },
    'time.minutes':         { vi: 'phút trước',         en: 'min ago' },
    'time.hours':           { vi: 'giờ trước',          en: 'hrs ago' },
    'time.days':            { vi: 'ngày trước',         en: 'days ago' },

    /* PDF viewer */
    'pdf.meta':             { vi: 'FFC · Cập nhật 02/05/2026',
                              en: 'FFC · Updated 02/05/2026' },
    'pdf.zoom_in':          { vi: 'Phóng to',           en: 'Zoom in' },
    'pdf.zoom_out':         { vi: 'Thu nhỏ',            en: 'Zoom out' },
    'pdf.print':            { vi: 'In tài liệu',        en: 'Print' },
    'pdf.download':         { vi: 'Tải xuống',          en: 'Download' },
    'pdf.close':            { vi: 'Đóng',               en: 'Close' },

    /* ============== CHAT (user) ============== */
    'chat.new':             { vi: '＋ Cuộc trò chuyện mới', en: '＋ New conversation' },
    'chat.history':         { vi: 'Lịch sử',            en: 'History' },
    'chat.empty':           { vi: 'Chưa có cuộc trò chuyện nào. Hỏi câu đầu tiên để bắt đầu!',
                              en: 'No conversations yet. Ask your first question to get started!' },
    'chat.user.role':       { vi: 'Khách hàng · Miễn phí', en: 'Customer · Free' },
    'chat.agent.name':      { vi: 'Trợ lý kỹ thuật FFC', en: 'FFC Tech Assistant' },
    'chat.agent.status':    { vi: '● Đang hoạt động · Phản hồi trong vài giây',
                              en: '● Online · Replies within seconds' },
    'chat.disclaimer':      { vi: 'Thông tin từ trợ lý chỉ mang tính tham khảo. Báo giá chính thức và chẩn đoán chính xác cần kỹ thuật viên kiểm tra trực tiếp tại cửa hàng.',
                              en: 'Information from the assistant is for reference only. Final quotes and accurate diagnostics require on-site inspection by a technician.' },
    'chat.welcome.line1':   { vi: 'Xin chào! Tôi là',   en: 'Hi there! I am' },
    'chat.welcome.accent':  { vi: 'Trợ lý kỹ thuật FFC', en: 'the FFC Tech Assistant' },
    'chat.welcome.sub':     { vi: 'Hỏi tôi bất cứ điều gì về sửa chữa, báo giá, lỗi máy hoặc chính sách bảo hành.',
                              en: 'Ask me anything about repairs, quotes, device issues or our warranty policy.' },
    'chat.suggest.cat1':    { vi: '🔧 Báo giá sửa chữa', en: '🔧 Repair quote' },
    'chat.suggest.text1':   { vi: 'Sửa màn hình iPhone 13 Pro Max bao nhiêu tiền và có bảo hành không?',
                              en: 'How much to fix an iPhone 13 Pro Max screen and is there a warranty?' },
    'chat.suggest.cat2':    { vi: '📱 Lỗi điện thoại',  en: '📱 Phone issue' },
    'chat.suggest.text2':   { vi: 'Điện thoại tôi tự nhiên không sạc được dù đã đổi cáp — nguyên nhân có thể là gì?',
                              en: 'My phone suddenly won’t charge even after swapping cables — what could be wrong?' },
    'chat.suggest.cat3':    { vi: '💻 Lỗi laptop',      en: '💻 Laptop issue' },
    'chat.suggest.text3':   { vi: 'Laptop khởi động chậm và rất nóng khi chơi game — có nên vệ sinh + thay keo tản nhiệt?',
                              en: 'My laptop boots slowly and runs hot during games — should I get it cleaned and re-pasted?' },
    'chat.suggest.cat4':    { vi: '🛡️ Bảo hành',        en: '🛡️ Warranty' },
    'chat.suggest.text4':   { vi: 'Sửa máy ở FFC có bảo hành bao lâu và áp dụng trong trường hợp nào?',
                              en: 'How long is FFC’s repair warranty and what does it cover?' },
    'chat.input.placeholder':{ vi: 'Hỏi về sửa chữa, báo giá, lỗi máy...', en: 'Ask about repairs, quotes, device issues...' },
    'chat.input.foot':      { vi: 'Trợ lý có thể trả lời chưa chính xác · Báo giá chính thức cần kiểm tra máy trực tiếp',
                              en: 'The assistant may make mistakes · Final quotes require on-site inspection' },

    /* Lang switcher */
    'lang.vie':             { vi: 'Tiếng Việt',         en: 'Vietnamese' },
    'lang.eng':             { vi: 'English',            en: 'English' },

    /* ============== PROFILE PAGE ============== */
    'profile.back':         { vi: 'Trang chủ',          en: 'Home' },
    'profile.title':        { vi: 'Hồ sơ cá nhân',      en: 'My Profile' },
    'profile.sub':          { vi: 'Quản lý thông tin cá nhân và hồ sơ chuyên môn của bạn.',
                              en: 'Manage your personal information and professional profile.' },
    'profile.tab.overview': { vi: 'Tổng quan',          en: 'Overview' },
    'profile.tab.expertise':{ vi: 'Chuyên môn',         en: 'Expertise' },
    'profile.tab.activity': { vi: 'Hoạt động',          en: 'Activity' },

    'profile.section.basic':{ vi: 'Thông tin cơ bản',   en: 'Basic information' },
    'profile.section.basic.sub':{ vi: 'Cập nhật danh tính và thông tin liên hệ',
                                  en: 'Update your identity and contact details' },
    'profile.section.work': { vi: 'Thông tin nghề nghiệp', en: 'Professional information' },
    'profile.section.work.sub':{ vi: 'Chứng chỉ, kinh nghiệm và chi nhánh làm việc',
                                 en: 'Certifications, experience and branch' },
    'profile.section.bio':  { vi: 'Giới thiệu bản thân', en: 'About me' },
    'profile.section.bio.sub':{ vi: 'Một đoạn ngắn giúp khách hàng hiểu hơn về bạn',
                                en: 'A short paragraph to introduce yourself to customers' },
    'profile.section.social':{ vi: 'Liên kết mạng xã hội', en: 'Social links' },
    'profile.section.social.sub':{ vi: 'Tài khoản công khai để khách hàng kết nối',
                                   en: 'Public accounts where customers can connect' },

    'profile.field.fullname':{ vi: 'Họ và tên',         en: 'Full name' },
    'profile.field.email':  { vi: 'Email',              en: 'Email' },
    'profile.field.phone':  { vi: 'Số điện thoại',      en: 'Phone number' },
    'profile.field.dob':    { vi: 'Ngày sinh',          en: 'Date of birth' },
    'profile.field.gender': { vi: 'Giới tính',          en: 'Gender' },
    'profile.field.address':{ vi: 'Địa chỉ',            en: 'Address' },
    'profile.field.license':{ vi: 'Mã kỹ thuật viên',   en: 'Technician ID' },
    'profile.field.specialty':{ vi: 'Chuyên môn',       en: 'Specialty' },
    'profile.field.years':  { vi: 'Năm kinh nghiệm',    en: 'Years of experience' },
    'profile.field.workplace':{ vi: 'Chi nhánh làm việc', en: 'Branch' },
    'profile.field.bio':    { vi: 'Tiểu sử',            en: 'Bio' },
    'profile.bio.placeholder':{ vi: 'Chia sẻ về kinh nghiệm, chuyên môn và đam mê của bạn...',
                                en: 'Share your experience, expertise and passion...' },

    'profile.gender.male':  { vi: 'Nam',                en: 'Male' },
    'profile.gender.female':{ vi: 'Nữ',                 en: 'Female' },
    'profile.gender.other': { vi: 'Khác',               en: 'Other' },

    'profile.upload':       { vi: 'Đổi ảnh đại diện',   en: 'Change photo' },
    'profile.remove_avatar':{ vi: 'Xóa ảnh',            en: 'Remove photo' },
    'profile.role.short':   { vi: 'Kỹ thuật viên',      en: 'Technician' },
    'profile.verified':     { vi: '✓ Đã xác thực',      en: '✓ Verified' },

    'profile.save':         { vi: 'Lưu thay đổi',       en: 'Save changes' },
    'profile.cancel':       { vi: 'Hủy',                en: 'Cancel' },
    'profile.saved':        { vi: '✓ Đã lưu thay đổi',  en: '✓ Changes saved' },

    /* ============== SETTINGS PAGE ============== */
    'settings.title':       { vi: 'Cài đặt',            en: 'Settings' },
    'settings.sub':         { vi: 'Tùy chỉnh tài khoản, thông báo và quyền riêng tư của bạn.',
                              en: 'Customize your account, notifications and privacy.' },

    'settings.menu.account':  { vi: 'Tài khoản',        en: 'Account' },
    'settings.menu.security': { vi: 'Bảo mật',          en: 'Security' },
    'settings.menu.notif':    { vi: 'Thông báo',        en: 'Notifications' },
    'settings.menu.appear':   { vi: 'Giao diện',        en: 'Appearance' },
    'settings.menu.language': { vi: 'Ngôn ngữ',         en: 'Language' },
    'settings.menu.privacy':  { vi: 'Quyền riêng tư',   en: 'Privacy' },

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
    'settings.notif.new_question':  { vi: 'Yêu cầu mới từ khách hàng', en: 'New requests from customers' },
    'settings.notif.new_question.sub':{ vi: 'Nhận thông báo khi có khách hàng cần hỗ trợ',
                                        en: 'Get notified when a customer needs assistance' },
    'settings.notif.weekly':        { vi: 'Báo cáo hoạt động hàng tuần', en: 'Weekly activity report' },
    'settings.notif.weekly.sub':    { vi: 'Tổng kết đơn đã xử lý, đánh giá khách hàng',
                                      en: 'Summary of handled orders and customer ratings' },
    'settings.notif.product':       { vi: 'Cập nhật sản phẩm', en: 'Product updates' },
    'settings.notif.product.sub':   { vi: 'Tính năng mới và thông báo từ FFC',
                                      en: 'New features and announcements from FFC' },
    'settings.notif.marketing':     { vi: 'Tin marketing & khuyến mãi', en: 'Marketing & promotions' },
    'settings.notif.marketing.sub': { vi: 'Dịch vụ mới, ưu đãi và sự kiện',
                                      en: 'New services, deals and events' },

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
    'settings.privacy.profile_pub.sub':{ vi: 'Cho phép khách hàng xem hồ sơ và chuyên môn của bạn',
                                         en: 'Let customers view your profile and expertise' },
    'settings.privacy.activity':    { vi: 'Hiển thị trạng thái hoạt động', en: 'Show activity status' },
    'settings.privacy.activity.sub':{ vi: 'Khách hàng thấy bạn đang online hay offline',
                                      en: 'Customers can see when you are online or offline' },
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
