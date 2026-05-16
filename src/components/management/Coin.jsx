import BasicCrud from "./BasicCrud"

export default function Coin() {
    return (
        <BasicCrud
            title="Coin"
            description="Coin berish qoidalarini boshqarish."
            addLabel="Qoida qo'shish"
            initialItems={[
                { id: 1, name: "Darsda faol qatnashish", note: "+10 coin" },
                { id: 2, name: "Uy vazifasini bajarish", note: "+5 coin" },
            ]}
        />
    )
}
