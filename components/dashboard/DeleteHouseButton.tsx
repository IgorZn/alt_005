// components/dashboard/DeleteHouseButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteHouse } from '@/actions/house-actions';
import { toast } from 'sonner';

interface DeleteHouseButtonProps {
    houseId: number;
    houseTitle?: string;
}

export function DeleteHouseButton({ houseId, houseTitle }: DeleteHouseButtonProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        const result = await deleteHouse(houseId);
        setLoading(false);

        if (result.success) {
            toast.success(`Дом "${houseTitle || houseId}" успешно удален`);
            setOpen(false);
            router.refresh();
        } else {
            toast.error(result.error || 'Ошибка при удалении дома');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Удаление дома</DialogTitle>
                    <DialogDescription>
                        {houseTitle ? (
                            <>Вы уверены, что хотите удалить дом <span className="font-semibold">"{houseTitle}"</span>?</>
                        ) : (
                            'Вы уверены, что хотите удалить этот дом?'
                        )}
                        <br />
                        <span className="text-sm text-red-500 mt-2 block">
                            Внимание! Это действие нельзя отменить.
                            Все фотографии и данные о бронированиях будут удалены.
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        Отмена
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {loading ? 'Удаление...' : 'Удалить'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}