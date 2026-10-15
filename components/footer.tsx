import { Clock, MapPin, Phone, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer id="contact" className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">B</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Bánh Mì Hieudeptrai</h3>
                <p className="text-xs text-background/70">Ngon - Nhanh - Tiện</p>
              </div>
            </div>
            <p className="text-sm text-background/70">
              Mang đến cho bạn hương vị bánh mì truyền thống Sài Gòn chính hiệu, 
              với nguyên liệu tươi ngon được chọn lọc kỹ lưỡng.
            </p>
          </div>

          {/* Contact Info */}
          <div id="about" className="space-y-4">
            <h4 className="font-semibold text-lg">Liên Hệ</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-background/70">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>79 Đ. Số 6, Bình Đông, Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-background/70">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>079 913 2435</span>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Giờ Mở Cửa</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-background/70">
                <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p>Thứ 2 - Thứ 7: 6:00 - 11:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-lg">Vị Trí Cửa Hàng</h4>
              <a
                href="https://maps.google.com/?q=Bánh+mì+má+hải+79+79+Đ.+Số+6,+Bình+Đông,+Hồ+Chí+Minh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <span>Chỉ đường</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="w-full h-44 rounded-xl overflow-hidden border border-background/20 shadow-md bg-background/5">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.0319514682883!2d106.65181647655395!3d10.732019060008186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f140910af7b%3A0x2d8ec773d8eccad6!2zQsOhbmggbcOsIG3DoSBo4bqjaSA3OQ!5e0!3m2!1sen!2s!4v1792053670932!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Vị trí Bánh Mì Má Hải 79 trên Google Maps"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
