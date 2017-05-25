export class TorrentFilter {

    types: Array<{ type: string, label: string, checked: boolean }> = [];

    constructor(types: any[]) {
        if (types) {
            types.forEach(type => {
                this.types.push({
                    type: type.type || type.value,
                    label: type.label,
                    checked: true
                })
            });
        }
    }

    clone(): TorrentFilter {
        let filter = new TorrentFilter([]);
        for (let i = 0; i < this.types.length; i++) {
            filter.types.push({
                type: this.types[i].type,
                label: this.types[i].label,
                checked: this.types[i].checked
            })
        }
        return filter;
    }

}