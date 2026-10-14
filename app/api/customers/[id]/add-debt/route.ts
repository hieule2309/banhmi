import { NextRequest, NextResponse } from 'next/server'
import { addCustomerDebt } from '@/lib/customers-db'
import { updateOrderStatus } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { amount, note, orderId } = body

    if (amount === undefined || amount === null || isNaN(Number(amount))) {
      return NextResponse.json(
        { error: 'Số tiền cộng công nợ không hợp lệ' },
        { status: 400 }
      )
    }

    const updated = await addCustomerDebt(id, Number(amount), note)

    if (!updated) {
      return NextResponse.json(
        { error: 'Không tìm thấy khách hàng để cộng công nợ' },
        { status: 404 }
      )
    }

    // Nếu có mã đơn hàng truyền lên, đồng thời cập nhật trạng thái đơn thành đã hoàn thành
    if (orderId !== undefined && orderId !== null) {
      const parsedOrderId = Number(orderId)
      if (!isNaN(parsedOrderId)) {
        await updateOrderStatus(parsedOrderId, 'completed')
      }
    }

    return NextResponse.json({
      success: true,
      customer: updated,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Cộng công nợ thất bại' },
      { status: 500 }
    )
  }
}
