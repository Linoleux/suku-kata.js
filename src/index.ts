const kdift = { kh: '--', ng: '%', ny: '=', sy: '&', tr: '#', gr: '_' }
const dift = ['--', '%', '=', '&', '#', '_']
const vokal = ['a', 'i', 'u', 'e', 'o']
const awalan = ['be', 'me', 'pe']

const Replacer = (kata: string, pola: any) => {
    let result = kata
    for (const key in pola) {
        const regex = new RegExp(key, 'gi')
        result = result.replace(regex, pola[key])
    }
    // console.log('replacer:', result)
    return result
}

const Unreplacer = (kata: string, pola: any) => {
    let result = kata
    for (const key in pola) {
        const regex = new RegExp(pola[key], 'gi')
        result = result.replace(regex, key)
    }
    // console.log('unreplacer:', result)
    return result
}

const Preprocess = (kata: string) => {
    let result = []
    let tmp = ''
    let inKonsonan = false
    let numKonsonan = 0
    const arrayOfChar = kata.split('')
    for (const karakter of arrayOfChar) {
        let isKonsonan = !vokal.includes(karakter)
        if (isKonsonan) {
            if (!inKonsonan) {
                inKonsonan = true
            }
            numKonsonan += 1
            tmp += karakter
        } else {
            if (inKonsonan) {
                inKonsonan = false

                if (tmp.length == 1) {
                    result.push(tmp + karakter)
                } else {
                    result.push(tmp.charAt(0))
                    result.push(tmp.substring(1) + karakter)
                }
                tmp = ''
            } else {
                result.push(karakter)
            }
        }
    }

    if (tmp.length > 0) {
        result.push(tmp)
    }

    // console.log('praproses:', result)
    return result
}

const Process1 = (listSuku: Array<string>) => {
    let result: string[] = []
    let i = 0
    for (const suku of listSuku) {
        if (suku.length == 1 && i > 0) {
            if (vokal.includes(suku)) {
                result.push(suku)
            } else if (vokal.includes(listSuku[i - 1][listSuku[i - 1].length - 1])) {
                if (i < listSuku.length - 1 && listSuku[i + 1].length == 1 && vokal.includes(listSuku[i + 1][0])) {
                    result.push(suku)
                } else {
                    result[result.length - 1] = result[result.length - 1] + suku
                }
            }
        } else {
            result.push(suku)
        }
        i += 1
    }
    // console.log('kaidah 1:', result)
    return result
}

const Process2 = (listSuku: Array<string>) => {
    if (listSuku.length > 1) {
        if (awalan.includes(listSuku[0]) && !vokal.includes(listSuku[1][0]) && !dift.includes(listSuku[1][0]) && listSuku[1].length > 2) {
            listSuku[0] += listSuku[1][0]
            listSuku[1] += listSuku[1].substring(1)
        }
        if (listSuku[0].length == 1) {
            listSuku = [listSuku[0] + listSuku[1]].concat(listSuku.slice(2))
        }
    }
    // console.log('kaidah 2:', listSuku)
    return listSuku
}

const Process3 = (listSuku: Array<string>) => {
    let result: string[] = []
    let i = 0
    for (const suku of listSuku) {
        if (suku.length == 1 && i > 0) {
            if (vokal.includes(listSuku[i - 1][listSuku[i - 1].length - 1])) {
                result[result.length - 1] = result[result.length - 1] + suku
            } else {
                result.push(suku)
            }
        } else {
            result.push(suku)
        }
        i += 1
    }
    // console.log('kaidah 3:', result)
    return result
}

export const Syllabify = (kata: string) => {
    let suku = Preprocess(Replacer(kata, kdift))
    suku = Process1(suku)
    suku = Process2(suku)
    suku = Process3(suku)
    return suku.map((s) => Unreplacer(s, kdift))
}
