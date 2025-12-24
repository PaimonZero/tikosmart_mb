import React from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

interface ConfirmDialogProps {
    visible: boolean;           // Trạng thái ẩn/hiện
    onDismiss: () => void;      // Hàm đóng modal (khi bấm Hủy hoặc bấm ra ngoài)
    onConfirm: () => void;      // Hàm thực thi khi bấm Đồng ý
    title: string;              // Tiêu đề
    content: string;            // Nội dung thông báo
    cancelLabel?: string;       // Nhãn nút hủy (Mặc định: "Hủy bỏ")
    confirmLabel?: string;      // Nhãn nút đồng ý (Mặc định: "Đồng ý")
    isDanger?: boolean;         // Nếu true => Nút Đồng ý màu đỏ (Dùng cho Delete/Logout)
}

export function ConfirmDialog({
    visible,
    onDismiss,
    onConfirm,
    title,
    content,
    cancelLabel = 'Hủy bỏ',
    confirmLabel = 'Đồng ý',
    isDanger = false,
}: ConfirmDialogProps) {

    return (
        <Portal>
            <Dialog
                visible={visible}
                onDismiss={onDismiss}
                style={{ backgroundColor: 'white', borderRadius: 12 }}
            >
                {/* Tiêu đề: Căn giữa cho đẹp */}
                <Dialog.Title style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {title}
                </Dialog.Title>

                {/* Nội dung */}
                <Dialog.Content>
                    <Text
                        variant="bodyMedium"
                        style={{ textAlign: 'center', color: '#4b5563' }}
                    >
                        {content}
                    </Text>
                </Dialog.Content>

                {/* Nút bấm */}
                <Dialog.Actions style={{ justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 }}>
                    {/* Nút Hủy */}
                    <Button
                        onPress={onDismiss}
                        textColor="#6b7280" // Gray
                        labelStyle={{ fontWeight: '600' }}
                    >
                        {cancelLabel}
                    </Button>

                    {/* Nút Xác nhận */}
                    <Button
                        onPress={() => {
                            onConfirm();
                            onDismiss(); // Tự động đóng sau khi confirm (tùy chọn)
                        }}
                        mode={isDanger ? "contained" : "text"} // Nếu nguy hiểm thì có nền màu cho nổi
                        buttonColor={isDanger ? '#ef4444' : undefined} // Red-500
                        textColor={isDanger ? 'white' : '#3b82f6'} // White hoặc Blue-500
                        labelStyle={{ fontWeight: '600' }}
                    >
                        {confirmLabel}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}