import BasicCrud from "./BasicCrud"

export default function Xodimlar() {
    return (
        <BasicCrud
            title="Xodimlar"
            description="Xodimlar ro'yxatini boshqarish."
            addLabel="Xodim qo'shish"
            initialItems={[
                { id: 1, name: "Creator", note: "Administrator" },
                { id: 2, name: "Manager", note: "Operator" },
            ]}
        />
    )
}
