import BasicCrud from "./BasicCrud"

export default function XabarYuborish() {
    return (
        <BasicCrud
            title="Xabar yuborish"
            description="Yuboriladigan xabar shablonlarini boshqarish."
            addLabel="Xabar qo'shish"
            initialItems={[
                { id: 1, name: "Dars eslatmasi", note: "Bugungi dars haqida xabar" },
                { id: 2, name: "To'lov eslatmasi", note: "To'lov muddati haqida xabar" },
            ]}
        />
    )
}
