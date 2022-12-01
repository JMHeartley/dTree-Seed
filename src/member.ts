interface Member {
    id: number;
    name: string;
    parent1Id: number | null;
    parent2Id: number | null;
    depthOffset?: number;
}

export default Member;