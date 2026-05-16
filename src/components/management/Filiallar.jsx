import BasicCrud from "./BasicCrud"

export default function Filiallar() {
    return (
        <BasicCrud
            title="Filiallar"
            description="Markaz filiallarini boshqarish."
            addLabel="Filial qo'shish"
            initialItems={[
                { id: 1, name: "AiCoder markazi", note: "Asosiy filial" },
                { id: 2, name: "Fizika va Matematika", note: "Faol filial" },
            ]}
        />
    )
}
