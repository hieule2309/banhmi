'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Search,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Copy,
  Check,
  RefreshCw,
  X,
  CreditCard,
  Building2,
  UserCheck
} from 'lucide-react'

interface Customer {
  id: string
  name: string
  debt: number
  phone?: string | null
  notes?: string | null
  created_at?: string
}

function removeAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
}

export function DebtSearchSection() {
  const [query, setQuery] = useState('')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const fetchCustomers = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/customers')
      if (res.ok) {
        const data = await res.json()
        setCustomers(data.customers || [])
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu công nợ:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  // Tìm kiếm chính xác (Exact Match hoặc Case-insensitive Match / không phân biệt dấu tiếng Việt)
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const cleanQuery = removeAccents(query)
    if (!cleanQuery) return

    setSearched(true)
    const match = customers.find((c) => removeAccents(c.name) === cleanQuery)
    setSelectedCustomer(match || null)
  }

  const handleClear = () => {
    setQuery('')
    setSearched(false)
    setSelectedCustomer(null)
  }

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  // VietQR config constants based on requirements
  const BANK_ID = 'CAKE'
  const ACCOUNT_NO = '0799132435'
  const ACCOUNT_NAME = 'LE QUANG HIEU'

  const getQrUrl = (amount: number, customerName: string) => {
    const addInfo = encodeURIComponent(`Thanh toan cong no ${customerName}`)
    const accName = encodeURIComponent(ACCOUNT_NAME)
    return `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${addInfo}&accountName=${accName}`
  }

  return (
    <section id="debt-search" className="py-12 bg-muted/40 border-y border-border/60">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <QrCode className="w-4 h-4" /> Tra Cứu & Thanh Toán QR
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Kiểm Tra Số Tiền & Quét Mã QR Thanh Toán
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Nhập tên của bạn để tra cứu nhanh số tiền còn nợ và chuyển khoản qua mã QR Ngân hàng tiện lợi.
          </p>
        </div>

        <Card className="shadow-lg border-primary/20 overflow-hidden bg-card">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-3">
              <label className="text-sm font-bold text-foreground block">
                Tên khách hàng:
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    type="text"
                    autoComplete="off"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      if (searched) {
                        setSearched(false)
                        setSelectedCustomer(null)
                      }
                    }}
                    placeholder="Nhập tên của bạn (ví dụ: Hieu, Hieudeptrai, Hieubanhmi)..."
                    className="pl-11 pr-10 py-6 text-base rounded-xl border-border bg-background"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={handleClear}
                      aria-label="Xóa nội dung"
                      className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground p-0.5 rounded-full cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={!query.trim() || isLoading}
                  className="w-full sm:w-auto px-8 py-6 text-base font-bold rounded-xl gap-2 shadow-md shrink-0 cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  Tra Cứu
                </Button>
              </div>
            </form>

            {/* Search Results Display */}
            {searched && (
              <div className="pt-2 animate-in fade-in-50 duration-300">
                {!selectedCustomer ? (
                  <div className="p-8 text-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 space-y-2">
                    <AlertCircle className="w-10 h-10 mx-auto text-amber-600 dark:text-amber-400" />
                    <h4 className="font-bold text-base">Không tìm thấy thông tin công nợ cho tên này. Vui lòng kiểm tra lại!</h4>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto">
                      Không tìm thấy tên &quot;{query}&quot; trong hệ thống công nợ. Vui lòng kiểm tra lại chính xác cách viết tên hoặc liên hệ chủ quán!
                    </p>
                  </div>
                ) : selectedCustomer.debt <= 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 space-y-3 shadow-sm">
                    <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <h4 className="font-extrabold text-xl">Chào {selectedCustomer.name}!</h4>
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mt-1">
                        Bạn hiện không còn công nợ nào. Cảm ơn bạn rất nhiều! 🎉
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Customer Has Debt - Show Debt Amount & VietQR */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center rounded-2xl border border-primary/20 bg-card p-6 shadow-sm">
                    {/* Left Side: Debt Info */}
                    <div className="space-y-5">
                      <div className="space-y-1 border-b border-border pb-4">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Khách Hàng
                        </span>
                        <h3 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
                          <UserCheck className="w-6 h-6 text-primary" />
                          {selectedCustomer.name}
                        </h3>
                      </div>

                      <div className="space-y-1 bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
                        <span className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
                          Số Tiền Còn Nợ
                        </span>
                        <div className="text-3xl font-black text-rose-600 dark:text-rose-400 flex items-center justify-between">
                          <span>{formatCurrency(selectedCustomer.debt)}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={() => copyToClipboard(String(selectedCustomer.debt), 'debt')}
                            className="h-8 text-xs font-bold gap-1 border-rose-300 text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-950/50 cursor-pointer"
                          >
                            {copiedField === 'debt' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            {copiedField === 'debt' ? 'Đã chép' : 'Sao chép số tiền'}
                          </Button>
                        </div>
                      </div>

                      {/* Bank Details breakdown */}
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between py-1.5 border-b border-border/60">
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-primary" /> Ngân hàng:
                          </span>
                          <span className="font-bold text-foreground">CAKE by VPBank</span>
                        </div>

                        <div className="flex items-center justify-between py-1.5 border-b border-border/60">
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4 text-primary" /> Số tài khoản:
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(ACCOUNT_NO, 'stk')}
                            className="font-extrabold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            {ACCOUNT_NO}
                            {copiedField === 'stk' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center justify-between py-1.5 border-b border-border/60">
                          <span className="text-muted-foreground">Chủ tài khoản:</span>
                          <span className="font-bold text-foreground">{ACCOUNT_NAME}</span>
                        </div>

                        <div className="flex items-center justify-between py-1.5">
                          <span className="text-muted-foreground">Nội dung chuyển khoản:</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(`Thanh toan cong no ${selectedCustomer.name}`, 'memo')}
                            className="font-bold text-foreground hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            Thanh toan cong no {selectedCustomer.name}
                            {copiedField === 'memo' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Dynamic VietQR Image */}
                    <div className="flex flex-col items-center justify-center p-4 bg-muted/40 rounded-xl border border-border/80 space-y-3">
                      <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-primary" /> Quét mã để thanh toán nhanh
                      </div>
                      
                      <div className="bg-white p-3 rounded-2xl shadow-md border border-border max-w-[260px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getQrUrl(selectedCustomer.debt, selectedCustomer.name)}
                          alt={`Mã QR thanh toán công nợ cho ${selectedCustomer.name}`}
                          className="w-full h-auto rounded-lg object-contain"
                          loading="lazy"
                        />
                      </div>

                      <p className="text-[11px] text-muted-foreground text-center italic leading-relaxed">
                        * Mã QR tự động điền số tiền {formatCurrency(selectedCustomer.debt)} &amp; nội dung chuyển khoản.
                        <br />
                        * Sau khi chuyển khoản mọi người về chatwork sẽ có bot thông báo thành công ạ.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
