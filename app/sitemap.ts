import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://banhmianhtrai.shop',
      lastModified: new Date(),
      changeFrequency: 'daily', // Báo cho Google biết trang thường xuyên cập nhật
      priority: 1.0,            // Độ ưu tiên cao nhất cho trang chủ
    },
    // Nếu web bạn có thêm các trang phụ, hãy copy block trên và dán xuống đây
    // Ví dụ:
    // {
    //   url: 'https://banhmianhtrai.shop/thuc-don',
    //   lastModified: new Date(),
    //   changeFrequency: 'weekly',
    //   priority: 0.8,
    // },
  ]
}