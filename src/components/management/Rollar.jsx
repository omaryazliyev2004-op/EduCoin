import BasicCrud from "./BasicCrud"

export default function Rollar() {
    return (
        <BasicCrud
            title="Rollar"
            description="Tizim rollari va huquqlarini boshqarish."
            addLabel="Rol qo'shish"
            initialItems={[
                { id: 1, name: "Admin", note: "To'liq huquq" },
                { id: 2, name: "Teacher", note: "O'qituvchi huquqi" },
            ]}
        />
    )
}
