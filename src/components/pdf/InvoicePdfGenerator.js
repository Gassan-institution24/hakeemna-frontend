// src/components/pdf/InvoicePdfGenerator.js
// eslint-disable-next-line import/no-extraneous-dependencies
import pdfMake from 'pdfmake/build/pdfmake';
// eslint-disable-next-line import/no-extraneous-dependencies
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { fCurrency } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';



pdfMake.vfs = pdfFonts?.pdfMake?.vfs;

// 📌 حمل خط عربي (مثل "Amiri") وضعه في public/fonts أو base64
pdfMake.vfs['Amiri-Regular.ttf'] =
  'AAEAAAASAQAABAAgR0RFRrRCsIIAAHUEAAACYkdQT1O4Bf2cAADEwAAAHEdHU1VCAA0A4QAAyMAAAJmT1MvMj0AIzAAAM... (محتوى طويل جداً) ...';

// تعريف الخطوط
pdfMake.fonts = {
  Amiri: {
    normal: 'Amiri-Regular.ttf',
    bold: 'Amiri-Regular.ttf',
    italics: 'Amiri-Regular.ttf',
    bolditalics: 'Amiri-Regular.ttf',
  },
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf',
  },
};


/**
 * توليد محتوى PDF للفواتير
 */
export const generateInvoicePdfDoc = (invoice, qrDataUrl, lang = 'en') => {
  const isArabic = lang === 'ar';
  const patient = invoice?.patient || {};
  const services = invoice?.Provided_services || [];
  const products = invoice?.provided_products || [];

  const bodyRows = [
    [
      { text: '#', bold: true },
      { text: isArabic ? 'العنصر' : 'Item', bold: true },
      { text: isArabic ? 'الكمية' : 'Qty', bold: true },
      { text: isArabic ? 'السعر' : 'Price', bold: true },
      { text: isArabic ? 'الإجمالي' : 'Total', bold: true, alignment: 'right' },
    ],
    ...services.map((item, i) => [
      i + 1,
      item.title,
      item.quantity,
      fCurrency(item.price_per_unit),
      { text: fCurrency(item.income_amount), alignment: 'right' },
    ]),
    ...products.map((item, i) => [
      services.length + i + 1,
      item.title,
      item.quantity,
      fCurrency(item.price_per_unit),
      { text: fCurrency(item.income_amount), alignment: 'right' },
    ]),
  ];

  const docDefinition = {
    defaultStyle: {
      font: isArabic ? 'Amiri' : 'Roboto',
      alignment: isArabic ? 'right' : 'left',
    },
    content: [
      {
        columns: [
          { image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUwAAAEmCAYAAAAJAaljAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAHYcAAB2HAY/l8WUAAChxSURBVHhe7d0HeFNV/wfwm3RvWjqAMkW2LEFAZe+/vCggAqKAgCgqICggIKiIgiIKioIiuyCiILJbpoLsjVCQPbvp3m2Sf074AUlzb3Kyk/b7eZ487/md0toX0m/PPfecc2UqlUoAAADj5PS/AABgBAITAIATAhMAgBMCEwCAEwITAIBTqb5Lfqco7YkMZV5EvqrIv1BV7FugLPYrUP+vm0xW7CXzyPGSued4yzyyfeWe6WHuAdeD5D6J9KkAAHpKRWAmFGfU2pd7aejF/Pi2icrMmjnKgpBilcqTPsyN/WV4yT2yQuT+cVU9g88086m+8WmfmmvowwBQxrlsYK5IPzj/VP7tHqnKnMpKldKDum3CT+6VVsUj5Gz/wOZTanlGHKRuAChjXCowrxYmtVyVfuSby4VJrdTfuUPmXwNkXsmd/esvfDGw2cfUBQBlhEsE5qasM5Njsv99N0OZH0FdDuemkhc38Km0e1i51m+GuvnfpG4AKMWcNjCzlQUhy9P/WXAi/1avIpXCi7qdUiW3oAuvlnv6vUbelaOpCwBKIacMzD8yT37yR+apaY667DZXBbfA/6aG/a9DOTffeOoCgFLEqQLzbnF6/Vkp23akK3Ijqcv1qGTKfkHNpz4f0HgW9QBAKeE0gbk0/Z8f92ZfeEMlk8moy6WFuQXc+DCsR3vMbwKUHg4PzBRFdrXpyRsPpinyKlFX6aEebQ4u12psV/8G86kHAFyYQwNza/a/49ekH/3S1eYqTVXdPeTUZxF9nqQSAFyUwwJzzr2YLafzb/egstTzFNxyZld4qQEu0QFcl0MCc1LS+nN3itIaUFlmuMtkhdNCe7at6Rl+hLoAwIXYPTBHJ6y5nabIqUxl2aOSKceHdu3ZxLvKNuoBABdh17nDMfG/3izTYcnIVPI5KTs2XytMfop6AMBF2C0wP0vZsjdVmV2VyrJNHZozUrbsV//ycN31pgBlkF0CMyrj0LyLBQntqQQ1tt1zYtK6c1QCgAuweWDuzrkwMib7/LtUgpY8ZVE5dgOMSgBwcjYNTLbVcVnawR+oBBFstUBUxuG5VAKAE7NpYH6cuPEIm6+jEiTEZJ8bezL/Vk8qAcBJ2SzMpidtOpgvFPlTCUbMS921PkuZH0olADghmwTm3pyLIy4XJT1NJXBgj9mYmbJtD5UA4IRsEpgrMg58T00wwe2i1Ib/5F4ZRCUAOBmrB+bse9HR5jyxEe5bnL5vETUBwMlYNTD/K0xofTb/TjcqwQzFKqX33Hs7N1AJAE7EqoG5JHU/RkdWcCLv1vPUBAAnYrXAjCtOrxunyKhHJVhCppIvTNsbRRUAOAmrBeZPafuWUROs4HDO9QHUBAAnYZXATFfkVrxWkNiSSrAChUzpvibj6GwqAcAJWCUwV2cc+bq0PLzMmfyde3E4NQHACVglME/lYVufLWQrC0NwbiaA87A4MC8WJLTFFkjbWZd1YgY1AcDBLA7MtRnHZlETbOBcQVxHagKAg1kcmOpLxhbUBBtge8yP5d3oQyUAOJBFgXm+IK4Tu5tLJdjIvtzLQ6gJAA5kUWD+lXPxdWqCDV0pSHyGmgDgQBYFZmxhQjtqgg1lqXBOJoAzsCgwM4tzKlATbGxnTuw71AQABzE7MJMVWTWwWN1+rhQmtqImADiI2YF5uyjtCWqCHcQVZdSlJgA4iNmBGV+cUYeaYAepiuwq1AQABzH/krw48zFqgh3kqAqCqQkADmJ2YGYocyOoCXaAx34AOJ7ZgalUCW7UBAAoEywITBUC087u4EYbgEOZHZgqmdLszwXzpClzK1ETABzA7NArVqmwh9zO2Mn21AQAB8Ao0YXkKHGnHMCREJgAAJwQmAAAnBCYAACcEJgAAJwQmAAAnBCYAACcEJgAAJwQmAAAnBCYAACcEJgAAJwQmAAAnBCYAACcEJgAAJwQmAAAnBCYAACcEJgAAJwQmAAAnBCYAACcEJgAAJwQmAAAnBCYAACcEJgAAJwQmAAAnBCYAACcEJgAAJwQmAAAnBCYAACcEJgAAJwQmAAAnBCYAACcEJgAAJwQmAAAnBCYAACcEJgAAJwQmAAAnBCYAACcEJgAAJwQmAAAnBCYAACcEJgAAJwQmAAAnBCYAACcEJgAAJwQmAAAnBCYAACcZCqVipqmmXZwbfTpjNvdqAQ7qFMnMrZcYGAylS7FS+ae6yvzyPCVeaX7y73uBbv7xtX1rLivskfwOfojAE7P7MDsO23W+eMbztenEuyg1frWgru/O1WlA3sDesk9skLk/nFVPYPPNPOpvvFpn5pr6MMATgWB6UJKY2BK8ZN7pVXxCDnbP7D5lFqeEQepG8ChMIcJTilHWRB8sSC+3fTkzQfeiotKWp95Yjp9CMBhEJjg9LJUBWEbsk59NOTO0qLZ96KjUxTZ1ehDAHaFwASXoZAp3c/m3+k2NuHXGxMTfo9Vt7vThwDsAoEJLilOkVFPPdrcPj7ht4vpityK1A1gUwhMcGkJisw6o+LX3NmUdWYydQHYDAITXJ9MJf8t89jMcQlrr2N+E2wJgQmlRrIiq/rY+LXXdmSfH01dAFaFwITSRT3aXJlx6LupiX+cpB4Aq0FgQql0ozi16bC7y7JxiQ7WhMCEUqtQUPiNT1x76WphUkvqArAIAhNKtWKVyvPjpM0HT+fffo66AMyGwITST6aSz0nZsflaYfJT1ANgFgQmlA3q0JyRsmV/miInknoATIbAhDKjSKXwmpi0DudvgtkQmFCm5CmLyk1KWo/QBLMgMKHMuVOU1iAq4/BcKgG4ITChTIrJPjf2ZP6tnlQCcEFgQpk1L3XX+ixlfiiVAEYhMKHMUqqUHjNTtu2hEsAoBCaUabeLUhv+k3tlEJUABiEwocxbnL5vETUBDEJgQplXrFJ6z723cwOVAJIQmABqJ/JuPU9NAEkITABGppIvTNsbRRWAKAQmADmcc30ANQFEITABCHuM75qMo7OpBNCDwATQ8nfuxeHUBNCDwATQkq0sDMG5mSAFgQlQwrqsEzOoCaADgQlQwrmCuI7UBNCBwAQoge0xP5Z3ow+VAA8hMAFE7Mu9PISaAA8hMAFEXClIfIaaAA8hMAFEZKlwTiboQ2ACSNiZE/sONQE0ZCqVipqm6Ttt1vnjG87Xp9IqwjpECEGNggTfqn6Cu7+7kBefJ+TdyhUStscL+eq2JXyr+grhXSoIgU8ECZ7BnkJxjkLIv5srZF/JFuI23hWUBQr6kyaSqb/v9hFC+dahgm9lX8HN100ozi4Wcm/mCvf+SRZS1C9rabW+tebvBezjWd+aq94K7oCzMuEhpwhMvxp+Qs3RtYXABkHUo0tZqBTiN90Vbiy5JqiUpn+/VQdVF6oMqCbI3NXpJqIguUC4/tMVIWW/aeHmGeol1PuogRBQJ5B69GWeyxAuzDgvFKUXUo/5EJj2VcMj9PiM8F5YxA4POfyS3CPIQ2gws7FkWDJyT7kQ2beKUO21GtTDr/rwx4Sqr1aXDEvGK8xLqDO5vnp0W456jHPzcROemNXYYFgybET7xBeNBLmXG/WAq0hVZFehJoCGwwOz1nt1Bc8QT6oEoTClQIjffFe489stIeNsOvXeF/lSFcG/dgBVxpV7Mlio3K8qVYKgKlZqRnx3/7ijuQzPVV/uPyBzkwm1J9YT3Lz5go2NWtllvra827lC6pF7Qn5iPvXc51fDX6g6sBpV4CpyVAXB1ATQcGhgsrnEkFblqVK/Qa9nC8eHHRWufn9Zc/n974TTQtyGO/RRdajJZZoQ5FV96GPUEgRFvkKI/eSccPb9U5rL72sLLgsn3zgqJO5IoD9xf6QZ3OLR9yOFhWqFHpWouu/GsmvCidePCrEf/SscH3xYM4WgreILkepRJu6xuZJilerRb3IANYf+BAc10b0EvrXyht7Nl/gtcdS6z7+mP7UMY/Oi2qNR9rXTjqVSRVSCOpwvaW7SPBDSIoRa0sq3DtMZiaYdTxXu/HqLqvuu/nBZyLqQSdX9S/jyz2ClCoArc2hgFt4r1ATZg1faiTT6yCNs/lIbu7vNo3ybMGrdv2mkPZLUpixQakadZ9+7/7q7/tGIVgqbl9SW8ncStXQl7Umk1n1BDfnnSME55CoL8Y8GDzk0MNkc5a3V6rCkl9jSnsgXK1PrvvST+qEqxr/mo9Fl7o0coTirSHDzdRfCO1cQHhv5uOZV4f8qCv61AjQfzzyfoXmxaQFjfKvpzl1mxj4aSWorOQfrW82PWuAqClRF+EeDh5xuUs0r1EuI6F5RqPJyNaHxvCc1AfdA+qk0IWWf+GiuJJ8qj0KNLekJbRsmNF/WQqg9oa5QqXdlzevxsXWEJt83E574orHgXdGH/rRx7Ht8SKUS8hPE14jm3VH3ay3b8grX+jxwCQWqYt3fjlCmOV1g+j3uL9QaV0ezhCig3v0lO+yGDZsjZDdUeLHlSg94R/oKdT6oL3iUE5/DL9c0WGj6Y3PN3Wwe2vOXinyloCoWXxvK7sqzjz/A5jHBtaj/dfGPBg85XWCKYQEV3rWCUG3oYwbXU2rTDiefSB/N57FF7+zGz911t4Xkv5IERe6jmz3sv/H4uNqanTvGaN/tZqFoCJs/fUCuFbTgGjxl7pZtMYNSxekCU5GrEHKu56gvc/N1woat1YzsU1mzWNxoqKk/zpYgaWOj1HMfnBHOTz0rXP/5qvDfrFjh9OiTQmHaox04bBF6WLtwqqQpi7RGlDLD34xM629YpTB9lxI4lqfMDYEJDzldYLIbJadGHhOODzksHOq9X7j01UXNDZsH2G6cCt0rUiVBnUuKEjeQ2HrOkjdh8u7kakab2thNIGO0b04ZW1sp93w0qlTm8d3hB+ehHmE+2t0AZZ7TBaY2NjeYtCtBuPLtJeq5L6xjBLWkKXIeXW4zbK2kmMx/M6h1H8+d7OKsR19b7iHXmS/Vxvq1A7W4xPcEzs9b5mF82QSUGQ4LTJ/KvpqdOA9eYR2kL4VTj97TOXTDu5LxO9qaO9RatBenaysZYu6Bxg+3yL2tO+jwe0z8ZlHJfrZ1ElyHm0qO33Cgw2GByRakVx5Q9eGLHZAhhY3iSs5JGpN9JYta90ndAffVWn7EFKU9uvyXknNNd9AhtV2z5DbLnBs51AJX4Cv31J3DgTLPYYGZezNHKMp4FE5sxBnaVnyUqb0Wk8m/a3wePuVv3aPaNAvgRTK3wv9094RnxupeootJ2af7tSO6VRS8wr2puo+NgiO66E4d3DuQQi1wBeXdfHUnuKHMc1hgsjvGiTHxVN1X6706QuX+VR8uDGfrJjXHug3VPdYtea/ulkMxWf9lCtmXHo0y2c0ctkCd/S8brXpX8Nb894KbP9o7zm4uJUlsodTGbhaxXUEPsLnKhrMbaw5AZnvYwztFCA2/bCy4Bzya22Sj0uzLuqNecG6RnsHnqQmg4dADhNmRao3mNhU9U5Ld8BFbc5l6+J4Q+zHfAvaAuoFCo6+b6n0dNh8qdonPbi4lbNM97EMK+54bzVN/bZ6pAvVf8bkpZ7i3dUrBAcL2NSK47fB2vrWXUgng2LvkbJT538xYzV7uksTCko3QLs25SJVxWRczhUtfX9Rb/6gXcuoPJ2yN4w5Lho1gr86/rP5c479wbiy9ZnFYgv0hLKEkhwYmwxaon3rruOY4NHZ4sJiCpHzN6O/06BM6azJ5JO9JFM68e1LIOJMu+niLvLt5wrkPzwpXvtNdusSDBey5SWd1Lv215d7KES58ck5zGDK4lgCZD9+hBVCmONVD0Bg2H8jWQrI5xoKkAs3pQdo3hyzhEewpBNQO0OwaUuQpNA8q4zmdiAf7fv1qBggege6apUps1Kx9ors14JLcfpp6V9v0fvkuL1AJoOF0gQnSEJj2MzqkU7+WPjV+pxJAw+GX5ADOhi1YR1iCGAQmQAn1vCvuoSaADgQmQAkDglpMoiaADgQmgBZ/uWdqdY/yp6gE0IHABNDSwa/uImoC6EFgAhB3maywf2CLyVQC6EFgApBW3o+voSaAKAQmAKOSKUeGtHuNKgBRCEwAtVa+1bHuEoxCYEKZ5yG4544K6TSASgBJCEwo80aV7/AKNQEMQmBCmVbDI/R4M+9qf1IJYBACE8ostoxoRnivp6gEMAqBCWUSO6brg/LPdaUSgAsCE8qk3oHNPq3nVfFvKgG4IDChzKnpGXakT+CTn1AJwA2BCWVKgMwreXrYC62oBDAJAhPKDLbe8qsK/epSCWAyBCaUCXKVoJgV0bupv9wrlboATIbAhFJPLpMXTQvv2baCe5DpjwYF0ILAhFLNU+aW91V433q1PCMOUheA2RCYUGr5yD3Sv63wctUI98Cr1AVgEQQmlEp1vSr+/XPFIcEBcu8U6gKwGAITShU2X/lmcLvXpob2aE9dAFaDwIRSI9Kj3LkfKgys1Ma31grqArAqBCa4PDaqfL1cmxFfhvdtiEtwsCUEJrg0ts1xZaVhnu396iymLgCbQWCCy2EnDdXwCD3xcVjPZ7HNEewJgQkuw0PmVtDa9/GohZUGh84I79UcayvB3hCY4PRC5P63Bgc9PWZZpaHeI4PbD8b2RnAUBCY4HXbJzU4VaupVdcuciJfqfFdxQLWu/g3m04cBHIa9N6lpmr7TZp0/vuF8fSrBDlqtby24+7tTVUqoZEo/N8+MEDe/W2xesoVPjfVNvKtso48COBWzA/ObFX98uWT9jolUShoysOv31aqGY2uaFQTWClTIfORuVLoUD5lbvpfMI8dL5p7jLffI9pN5plX0KPefj8wjk/4IgNMzOzB/+W3Pm1M+XfojlZLWLv+wfcvm9fAoAABweZjDBADghMAEAOCEwAQA4ITABADghMAEAOCEwAQA4ITABADg5LB1mLnKwnI3i+41odIlsMXXj3uGH6YSAMoYhwXmhYL49p+nbN1LpUsIlfvdnFfx5epUAkAZg0tyAABOCEwAAE4ITAAATk45h1mcXSyoipRU6XMP8BBk7jKqTKD+v1qUXkiFPpmbTHAP9KBKnzXmMNPSs8srFAqDZ7SFBAcmy+Uy6b8AI+6lZoar/10l/4JCywclUpNbalpWqFKpNHpSUoC/b4aXl0c+lRqpaZlhSqXKqr+c3dzcioPL+d+jUkdWdm5QQUGRN5VWUz4kMEkmk+n9wOTlF/rm5OQFUCmqnPp7dVd/z1RaVcq9jAhqivLx9sr18/POolJHsfq9mK5+T1Ipypz3S0lFRcWeGZk5wVTq8fbyzPP39zH75KrCwiKvzKzcclSKsvS/wThlYF749Jxw74D0w/8afdNUCGwQRBW/4swi4fBLB6jSF1g/SGg0tylV+iwNTPaD1aL9O3ezsvMM/sMu+nZc766dmv1JpckathqRJvXfcPdwL7xyarkXlVzW/bnvtfFTFy2jUlKrp+rvXbrg/Z6+Pl451KXxdKd3b8Un3qtCpVU0bljz6MY101tSqWPcpIVRG7YceJVKq/n38KJy7BcClQ8tWbl93IzZq7+hUtSMqa+9M2hA5wVUWs3BI7EdBw6fuZtKUW8N7/nlB+P6T6JSx7+x15v17DftOJWirPG9G/s+X+nX6cfPPxr6FpUm+37Rxg/nfPf7Z1SKali/xonNv81oTqVZcEluRzt2H+9lLCyZTdsOvkxNh9u558QLH3y8eBGVkpo3qX1g8fxxvUqGJdy3dFX0GAXHCN1US1dGj6Wmzcz8avVX52JvPEmlU9q07ZDRnxn2y+HipVuNqDQLAtOONm87PICaBu3661RPQ5cv9sJGBWMmfP+LQqGUnqdQa9Ko5pEl6pGlpZc7pdn1Gwl1YnYd702lVbAf/l1/n+xJpc3kFRT5jpu8IConJ9/gtIOjnD57teWlK3caUGnQRo5gNQSBaSdsnmnvP6e7U2lQfkGhz/adx16k0iHOnr/e/K2x365jPyzUJeqJ+tVOLlswoUdQoF8adYEEa48GF6+MHkdNm7t8Na7+1BnLrD6lYA2bth/kGogwW7Yf6m/JfDoC0062RB/pZ2ykpm2zCW8Ca7t6Pa7u66PmbMrIMjzKrVuryr/LF058TurmC+g6fvrSs0ePX2xLpUXi4u9V/XPrwYFU2gWbF177x1/DqXQK7KbV1pij/ag06vbdlBqHj11oT6XJEJh2snnbIZMC8NDR2A537ibbfVcR+0Ec9tbXW5KSMypSl6iaNSpdWPHTxO7WuINalixZFfMuNS2ybHXMmOKiYk8q7ebTL6PmXrx8uyGVDrf/wL9dE5PSKlHJZfN2034WtSEw7YCN2E6cufwMlVyUSkHOM5FtTWz5z7C352y5eSexJnWJqlGtwuWoRR90jwgPjqMui0RGht2oGhl+zZRX+eCAZPp0k4WGBiWIfU1jL5mgv6TIVDv3HOt15VpcPSrNwua3f1231yEjvZycgoBxHyyIys0r8KMuhzLnZ2RbzNG+bNqLSpMgMO3A3ODbxHmTyBrYhP7wUXM3Ghs9VIkMvc5GlpUqlr9FXRbb+ecXT+yL+aamKa+lC8b/jz7dZF99OmK42Nc09rLGTS32i3DZqpgxVJpl9drdI3lWW9jKhUu3G0+fFfUtlQ7D3rM79h5/gUpubKqJ3Vil0iQITBtjC8g3GbgEYDdNqKnn4uVbjdhSCCpthi36HTl23vpTZy4/TV2iKkaUv73yp0ndq1YOv0ZdYIY/Nu4bnJySUYFKk7AF+SvX7HiHSodhc5l/bP5nEJUOEb3rWB824qVSh7vcrbhe7SpnqNSzeZt59wgQmDZ2/NSlZ6/fSKhNpZ4Pxr08qXyI9DygrS/L2drAsZMWrNp/6FwX6hLFLr9X/DTh/2pUr3CJusBMbOXBqrW7zFqkzUIqISk9kkqH+ujzlfMtnV6whKGBSKuW9f56qXe75VTq2b3vTA82BUUlNwSmjW3eLn1ZHR4WFP9My/p7unRoupm69GzZdqi/LRY8M2z0++H0pT9u23GsL3WJCgkOSFq+cMJztR+vfJ66wEKr1u5509R5QLYcRn05b5WbRtaQnZ0bxHZVmTsfaImEpLTIAwfPd6ZST5cOzTZ269R8A5V62A2zbTuOGnzfi0Fg2hDbP7sl+vBLVOrp0qH5Rje5XNG1U3PJbZDxSWmVDxw6J/nGsMQX3/z65a/r/3qdSlHqsExZ/uPEHvXqVJW8vAHT3UvNiGBbTqnksmPP8V68C7TthU0Zff7VL3OotBu26qRYKX0mQ9eOT26MrBR6s2njWoeoS485O+oQmDa0d9+Z51LTssKp1NO1Y7ON7H9bt2qwK7icn+Raxo3W3CqpUMm3xBzpN3POmq9+WrZ1AvWKCvD3SV/8/XvPN2pQw+BeYzDPstUxo025elgatd3m2yBLYoHDVkVQKSrq111vqwcG/am0C0PL9J56ss4/FSuUv83aLDg1nSKOnrjU5vrNhFpUckFg2pChORY2cmOX46zt6elR0KFN022aD4iI3n28d05uvj+VFmG/lUe9P3/touVbx1OXKD9/70x1WPZ60sBvaLAM2y4ZvfNYHyoNYgve2Q84lXYTGOib/vXMN4ewQ1uoS9SH05ctvHEr8XEqbYqt5Dgbe13yEI0uWiHZvdNTkpfljKEpMzEuGZhxG+4IV3+4bPLr+hL73dxlR03t3ntCculCx3ZNt3hovQkNnU6Uk50fyA7BoNLm/Hy9sxfNG9dH7JQpW/h2wR8fs5NmeF5swTZ9mtnYjhWxry31YqdM0aeaRf3LUXLNKO92ycVR2yW3QbIrAWraBPulOWHMS1OpFMWW6oydvCCKrbigLpsxdiO0a8dHU1zsJqWhlSgbt5p29eaSgZmyP1mI33TX5FdidDx9BdvbvvPoi4b2YXfrqBuQ7Vo3jmajOir1mPqb0FzszMAfvh7d79lWDQweGWZNbGqAHc/F81q/cd8Q+jSzsR84sa8t9crPt+ymRu+erVexX0JU6mAbGo4cv9COSlFs3nLX3hPPU6lDLheUA/p2WEKlzbzx2nNzOql/yVMp6vSZq62+mPvrF1TaBLvxtWWb9OV/4wY1jlWvGnGFSo2uHZ+SHIxcvR5X79SZK62oNAqX5DZiaELZ3983o82zDXdQqeHj7ZnboXWT7VTq+eufM92SktMNble0hqLiYnexQ3LBfGxX0osvtFlBpZ6lUdEG73wvWRk9ji14p1JHp/bNNteqGRlLpc2w98TsGSOGV6oUepO6RC2Nihkbs9u6pzJpY/vAb91NeoxKPV06NdebszR2tqwpS/cQmDZwNy6lGtsLTqWejm0bb2MjOSofenATSAw7uIPdrKHSZth/Z9T4+WtiL950qUcgO7uhr3T7jo0GqdSxc++JFy5fvVufSh3xiamVN2z95xUq9Qwf1H0eNW2OnTg/Z8Ybw9iicOoSNfmTJT/Z6hwEY/vA1T9DeuHIDokxtCRuc8zhfsXFCq6DcRCYNsB+Y0mNCBipYOzYtslWHy+PXCr1mHKMlSXYtrsR787bwH5YqQssxObSund+6g8qdWi2S0rMza5YvWN0YUGx6OM2mjWudbDVU/X+otIu2I3KUSNfMHiyeWpaVth7Uxau5A0hXmyXU/Suo5I3yQwFo1iQPpCSklHh7wNnu1FpEALTBtSX45LBxgKxQ5smonfE2V7ltq0bxVCph80RSY1EeLFRzti3+0w3tG2MuaseIbwxeu6f2dl5gdQFFhr6anfJ/dcbNu4fVHK7JHs20Zrf946gUs+wwfYbXWobPbLXZ8+2qm9wjpvd0Wc3zKi0il1/neyZlp4j+fwhQ5fe3TpLL2JneO8RIDCtjB3lzw4noFIPC0SpB1IxXTvqz8Fos+RoKkbu5l6sDsxPFs1/rzc7tYe6RbFFyWMm/vALO3OQusACbH0ge1Gpg90gjPp159tUaqz+bc+bUmeSqkes/3XvIj5itTW22eLrmW8NMfb+WbR8y/g9+073oNJim4yEWhcDU1rseT6GtvWyVSg8gwOXDMzIPpWFx96uZfKr+lDJuWKr2bjN8KGuxgKxU/ummw2teWO/CQ09EZJXlciw6/NnvzPQ2Po69ob/6PMV31NpE1PGvzzhk8mDx/C8Xh/8nMGHjfF4tX/nhWJfW+plzecUDTMw57hq7e43H6y3ZctzVqzeOUrzARFDX+k2nwUXlXZXITz47uxPRxjcJcamGiZ+9PNia0ztsKeW7t1/6jkq9bDF9SwUqRTVtYN0oLK/d56nHOCpkVosfWok27XRuvO7N9h2RurSM37MS1PLBfmlUilq8Ypt7924lSS5CPi35VPbtWhedx+Vekx5aiTbpTHts+U/UCnpg7H9J7/1ek+zlowYe2pk7LEl/tYMJWNPjVy2YHyPDm3Fp0XMYeypkRPf7Tfl7RHPz2Jt9h7p/PzE82zRuuaDJUyfMmT0kIFdvv9tw9/DJk77WXS5EDusZX/MNzUf/J0Z+rOMJU+NbNem8fYVCydIBhXbMWZsEwSb92Tfw6A3vpScbjL21Eh2WMnUGcslH5HRolnt/c8/98waKkWx6awVv0j/EmrzzBM7ohZNMjiXiUtyKzp4+HwnQ2HJsHkd9g9v6GUoLBljlyamYI9PZW9WKiV99d3az219clJZwEaFbHRIpZ7lv8SMZjdLDC1oHzSg04/O8nTOiWP7TWFPDKVSFHuY3g8/b5xMpVmMvefZnKnYz5L2y1BYMgcOn+scn2D4cdAITCuy9Il0vLbtONLXmjsqPpk86N0H2zSlsMurD6YtWmytZ9KUZX17tV3OToCiUgc7CpCNFqUOcmY3DV/t32khlQ7n7u5W9M0XIwcbOguBOXzsotnP0WFbLu3xvmPv8c1G9sQjMK2EHdUVbeXHqEphyzb27j8jeZlkKrZFc/5Xo16uVjniKnWJYjcmRo779vdrN+JFLyeBDxsdqkPvJyr1GDqY98Ve7VY423OU2IHSn00bZtb5njwsvdFpCmMnGCEwrWTH7uO92PmAVNqctS+P2aLkBXNHv2RoeybDTl96fdTcP++lZkqewgTGDRrQZYHY5gVD2JKwYYO6OfzREGJ6dGv5O5veodKqzDmGzVznYm8+eeG/W5KrXBCYVmKvvd4P7P7r1P/SM7JDqLSKBvWqn/py+gjJdX8PXLsRV/etcfPWOeLg2NIiLDQooc/zraOo5MIWvj9WveJ/VDqdDycMHG/ooAtzsH3e7JnoVNqFocEIAtMK2IJjttebSrtgYcWzDMJU/+vW8rcxI3vNoFISm2QfP+Wn5ZY8FL+sG/pqt2+ltkuKGTbo/xyyUJ0XGzHP++KdV41dpZjCnpfjD2yKPtxf6n2NZUVazF1WxLa1GXqKXr261U7P/vR1g2vWxPy55eArbMkKlXrYjZpflkzpROVDpiwrEsPWeY4c9926mF3Gz2p847Uec9g6SipFGVtW5OYmL5LJ5Sa9Edmauw2rPxZ9dLGxZUWavdBuMu6geuDU/gXhAf6+GVQ+ZMqyopJGjJn7J8/RfS2b1/177fKpojdOHLmsSAw7SX781EXLqOQitqyIrRZ4psuYm4aekc/WyTZrWusglVwUxUr3V96YtYMdm0hdetjPldiNUIwOrMDY43B7dG2xjv2Am/rq36edwWO7Dh+LbX/7bnINKq2GnUzzzedvvsaCnroksTV4K9fstOgphuzAD/aMFVNeSguec8QOURb7msZe9OlWNUw9yqSmQcOdfHSpja0CePGF1pKnM/Had/DfrobCko1k+7/YfonYz46hV5NGNY90att0K30ZUVLzpghMC7Gn5hl7PK2hjf+GsIME2IECVOrRLIMwcFS/Jdj2zR/njulr6ImWD3w6a9U8ts+XSjDB0y3q723SuOZhKkXVqlkptnOHJzdR6RI+/fC1UZY+NM/YjU0WeuxYRCpNYuhkMGb7jmMvis3RIzAtZOwOnrGjpYwxdmiALReTV6sScfW72W+/wi6ZqUsUG7G9O2nBqrPnpR8bANKGGziUg2GHdsjlpk8hOBI7MHnurJGDDJ2+ZQjb121sqsLQwwONYQfgSB3qzLA9/Lv2ntQ7tBmBaQE212fs7rixwDPG2OhU83wTGwYVO3l92sRX36dSEpsPenP0NxvYWaDUBZz+r2uLddWrhuucEv4Aex68qXfTnQVbdTF5/MCJVJoketexPoaeY8XCrkObxmZvb2VXUG2faSi5VZMReyYXAtMCx05eam3sqXOGno3Mg73pHqte6SKVomy9Tu21V7rOf7lvh5+plMS2hb4+Zu6f7HlG1AUc3N3cigcP7CZ6wAlb22jqek1nMvjlLj+wNZpUcjN2X6Bd64bRhkaIPLp2NjxC3aN56mtmGJUaCEwLGFvywIKuPseNE2O6dzEculu2H+pv6yPYPv1wyCh2p5ZKSRcu3mzyzvvfrbX24bGlXf/e7ZayJ4lSqeHn55U18KWOkjuCXMXMj4e9KTWCFpOQlBbJzmWgUlQXI6d+8WDPKDL0y4jd6NsSrfuUA6dcVuSsjJ1WBAClG0aYAACcEJgAAJwQmAAAnBCYAACcEJgAAJwQmAAAnBCYAACcHLYOEwDA1WCECQDACYEJAMAJgQkAwAmBCQDACYEJAMAJgQkAwAmBCQDACYEJAMAJgQkAwAmBCQDACYEJAMAJgQkAwAmBCQDACYEJAMAJgQkAwAmBCQDACYEJAMAJgQkAwAmBCQDACYEJAMAJgQkAwAmBCQDACYEJAMAJgQkAwAmBCQDACYEJAMAJgQkAwAmBCQDACYEJAMAJgQkAwAmBCQDACYEJAMAJgQkAwEmmUqmoaZrEpLRK128m1KZSUv261U4HBvimUwkA4LLMDkwAgLIGl+QAAJwQmAAAnBCYAACcEJgAAJwQmAAAnBCYAACcEJgAAFwE4f8BMY4Ld5RMFA8AAAAASUVORK5CYII=', width: 60 },
          { text: invoice.unit_service?.name_arabic || '', alignment: 'right' },
        ],
      },
      { text: isArabic ? 'الفاتورة' : 'Invoice', style: 'header', margin: [0, 20, 0, 10] },
      {
        columns: [
          [
            { text: isArabic ? 'من:' : 'From', bold: true },
            { text: invoice.unit_service?.name_arabic || invoice.unit_service?.name_english },
            { text: invoice.unit_service?.address },
            { text: invoice.unit_service?.phone },
          ],
          [
            { text: isArabic ? 'إلى:' : 'To', bold: true },
            { text: patient.name_arabic || patient.name_english },
            { text: patient.address },
            { text: patient.mobile_num1 },
          ],
        ],
      },
      { text: `${isArabic ? 'التاريخ' : 'Date'}: ${fDate(invoice.created_at)}`, margin: [0, 10, 0, 10] },
      {
        table: {
          widths: ['5%', '*', '15%', '15%', '15%'],
          body: bodyRows,
        },
        layout: 'lightHorizontalLines',
      },
      {
        marginTop: 15,
        columns: [
          { width: '*', text: '' },
          {
            width: 'auto',
            table: {
              body: [
                [isArabic ? 'الإجمالي الفرعي' : 'Subtotal', fCurrency(invoice.Subtotal_Amount)],
                [isArabic ? 'الخصم' : 'Discount', fCurrency(-invoice.Total_discount_amount)],
                [isArabic ? 'الضريبة' : 'Tax', fCurrency(invoice.Total_tax_Amount)],
                [isArabic ? 'الاقتطاعات' : 'Deductions', fCurrency(invoice.Total_deduction_amount)],
                [{ text: isArabic ? 'المجموع الكلي' : 'Total', bold: true }, { text: fCurrency(invoice.Total_Amount), bold: true }],
              ],
            },
            layout: 'noBorders',
          },
        ],
      },
      {
        text: 'Powered by hakeemna.com',
        alignment: 'center',
        color: 'gray',
        fontSize: 9,
        marginTop: 30,
      },
    ],
    pageMargins: [40, 40, 40, 60],
  };

  return docDefinition;
};

/**
 * دوال مساعدة للاستعمال:
 */
export const downloadInvoicePdf = (invoice, qrDataUrl, lang) => {
  const doc = generateInvoicePdfDoc(invoice, qrDataUrl, lang);
  pdfMake.createPdf(doc).download(`invoice-${invoice.sequence_number || 'unknown'}.pdf`);
};

export const printInvoicePdf = (invoice, qrDataUrl, lang) => {
  const doc = generateInvoicePdfDoc(invoice, qrDataUrl, lang);
  pdfMake.createPdf(doc).print();
};

export const openInvoicePdf = (invoice, qrDataUrl, lang) => {
  const doc = generateInvoicePdfDoc(invoice, qrDataUrl, lang);
  pdfMake.createPdf(doc).open();
};
