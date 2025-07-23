export function addWorkGroupColors(data, method = 'hex') {
    let generatedColors;

    switch(method) {
        case 'hex':
            generatedColors = () => {
                const chars = '0123456789ABCDEF';
                let color = '#';
                for(let i = 0; i < 6; i+=1) {
                    color += chars[Math.floor(Math.random() * 16)];
                }
                return color;
            }
            break;
        case 'rgb':
            generatedColors = () => {
                const r = Math.floor(Math.random() * 256);
                const g = Math.floor(Math.random() * 256);
                const b = Math.floor(Math.random() * 256);
                return `rgb(${r}, ${g}, ${b})`;
            }
            break;
        case 'hsl':
            generatedColors = () => {
                const h = Math.floor(Math.random() * 360);
                const s = Math.floor(Math.random() * 100);
                const l = Math.floor(Math.random() * 100);
                return `hsl(${h}, ${s}%, ${l}%)`;
            }
            break;
        default:
            generatedColors = () => {
                const r = Math.floor(Math.random() * 256);
                const g = Math.floor(Math.random() * 256);
                const b = Math.floor(Math.random() * 256);
                return `rgb(${r}, ${g}, ${b})`;
            }
            break;
    }

    const workGroupColorMap = {};
    const uniqueWorkGroups = Array.from(
        new Set(
            data
                .map(item => item.work_group && item.work_group._id)
                .filter(Boolean)
        )
    );

    uniqueWorkGroups.forEach(wgId => {
        workGroupColorMap[wgId] = generatedColors();
    });

    return data.map(item => {
        const wgId = item.work_group && item.work_group._id;
        return {
            ...item,
            color: wgId ? workGroupColorMap[wgId] : generatedColors()
        };
    });
} 