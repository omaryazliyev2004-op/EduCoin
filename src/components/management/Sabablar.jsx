import BasicCrud from "./BasicCrud"

export default function Sabablar() {
    return (
        <BasicCrud
            title="Sabablar"
            description="Davomat va boshqa holatlar uchun sabablar."
            addLabel="Sabab qo'shish"
            initialItems={[
                { id: 1, name: "Kasallik", note: "Uzrli sabab" },
                { id: 2, name: "Oilaviy sabab", note: "Tekshiruv talab qilinadi" },
            ]}
        />
    )
}
