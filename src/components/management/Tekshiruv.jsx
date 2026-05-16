import BasicCrud from "./BasicCrud"

export default function Tekshiruv() {
    return (
        <BasicCrud
            title="Tekshiruv"
            description="Tekshiruv ro'yxatlarini boshqarish."
            addLabel="Tekshiruv qo'shish"
            initialItems={[
                { id: 1, name: "Davomat tekshiruvi", note: "Haftalik nazorat" },
                { id: 2, name: "Coin tekshiruvi", note: "Oylik nazorat" },
            ]}
        />
    )
}
