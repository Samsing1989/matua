import firebaseDB from '@/firebase-config'
import {
    doc,
    collection,
    getDocs,
    getDoc,
    addDoc,
    arrayUnion,
    arrayRemove,
    deleteDoc,
    updateDoc,
    setDoc,
    query,
    where,
    documentId,
    limit,
    orderBy,
} from 'firebase/firestore/lite'

class DbOperations {
    constructor(collectionTitle) {
        this.dbCollection = collection(firebaseDB, `/${collectionTitle}`)
    }

    // вспомогательный метод для для прохождения по списку (querySnapshot.docs) и добавления в массив объекта с нужными полями
    getListFromSnapshot(snapshot) {
        const list = []
        snapshot.docs.forEach((doc) => {
            list.push({
                id: doc.id,
                ...doc.data(),
            })
        })
        return list
    }

    // загрузка полного списка из БД (сам список находится в поле querySnapshot.docs => getListFromSnapsh(querySnapshot))
    loadItemsList() {
        return new Promise((resolve, reject) => {
            getDocs(this.dbCollection)
                .then((querySnapshot) => {
                    resolve(this.getListFromSnapshot(querySnapshot))
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    // загрузка списка из БД с лимитом данных
    loadLimitItemsList(limitNum) {
        const q = query(this.dbCollection, limit(limitNum))
        return new Promise((resolve, reject) => {
            getDocs(q)
                .then((querySnapshot) => {
                    resolve(this.getListFromSnapshot(querySnapshot))
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    // добавление объекта item в список
    addItem(item) {
        return new Promise((resolve, reject) => {
            addDoc(this.dbCollection, item)
                .then(() => {
                    resolve(true)
                })
                .catch((error) => {
                    console.log(error.message)
                    reject(error)
                })
        })
    }

    // добавление объекта в список с кастомным id, т.е. id мы передаём в параметрах (в нашем случае для добавления юзера с присвоенным user.uid при авторизации)
    addItemWithCustomId(id, item) {
        return new Promise((resolve, reject) => {
            setDoc(doc(this.dbCollection, id), item)
                .then(() => {
                    resolve(true)
                })
                .catch((error) => {
                    console.log(error.message)
                    reject(error)
                })
        })
    }

    // метод добавления объекта в переданный через параметры массив arrayProperty (для корзины)
    addItemToArray(id, arrayProperty, value) {
        return new Promise((resolve, reject) => {
            this.getItemById(id).then((item) => {
                // в нашем случае if(item.card) если есть поле card - массив товаров в корзине для юзера с id, то в массив arrayProperty закидываем value
                if (item[arrayProperty]) {
                    const findObj = item[arrayProperty].find((el) => el.id === value.id)
                    if (findObj) {
                        findObj.count++
                        updateDoc(doc(this.dbCollection, id), {
                            [arrayProperty]: [{ ...findObj }],
                        })
                            // updateDoc(doc(this.dbCollection, id), {
                            //     [arrayProperty]: arrayUnion(value),
                            // })
                            .then(() => {
                                resolve(true)
                            })
                            .catch((error) => {
                                reject(error)
                            })
                    } else {
                        updateDoc(doc(this.dbCollection, id), { [arrayProperty]: arrayUnion({ ...value, count: 1 }) })
                            // this.addItemWithCustomId(id, {
                            //     [arrayProperty]: [value],
                            // })
                            .then(() => {
                                resolve(true)
                            })
                            .catch((error) => {
                                reject(error)
                            })
                    }
                } else {
                    this.addItemWithCustomId(id, { [arrayProperty]: [{ ...value, count: 1 }] })
                        //   this.addItemWithCustomId(id, {
                        //       [arrayProperty]: [value],
                        //   })
                        .then(() => {
                            resolve(true)
                        })
                        .catch((error) => {
                            reject(error)
                        })
                }
            })
        })
    }

    //  addItemToArray(id, arrayProperty, value) {
    //      return new Promise((resolve, reject) => {
    //          this.getItemById(id).then((item) => {
    //              if (item.cart) {
    //                  updateDoc(doc(this.dbCollection, id), {
    //                      [arrayProperty]: arrayUnion(value),
    //                  })
    //                      .then(() => {
    //                          resolve(true)
    //                      })
    //                      .catch((error) => {
    //                          reject(error)
    //                      })
    //              } else {
    //                  this.addItemWithCustomId(id, {
    //                      [arrayProperty]: [value],
    //                  })
    //                      .then(() => {
    //                          resolve(true)
    //                      })
    //                      .catch((error) => {
    //                          reject(error)
    //                      })
    //              }
    //          })
    //      })
    //  }

    // метод удаления объекта из переданного через параметры массива arrayProperty (для корзины)
    removeItemFromArray(id, arrayProperty, value) {
        return new Promise((resolve, reject) => {
            updateDoc(doc(this.dbCollection, id), {
                [arrayProperty]: arrayRemove(value),
            })
                .then(() => {
                    resolve(true)
                })
                .catch((error) => {
                    console.log(error.message)
                    reject(error)
                })
        })
    }

    // метод удаления объекта из списка
    deleteItem(id) {
        return new Promise((resolve, reject) => {
            deleteDoc(doc(this.dbCollection, id))
                .then(() => {
                    resolve(true)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    // метод оновления объекта в списке
    updateItem(itemId, data) {
        return new Promise((resolve, reject) => {
            const oldDocRef = doc(this.dbCollection, itemId)
            updateDoc(oldDocRef, data)
                .then(() => {
                    resolve(true)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    // получение объекта из списка по itemId
    getItemById(itemId) {
        return new Promise((resolve, reject) => {
            const docRef = doc(this.dbCollection, itemId)
            getDoc(docRef)
                .then((docSnap) => {
                    if (docSnap.exists()) resolve(docSnap.data())
                    else resolve({})
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    // загрузка фильтрованного списка из БД (в параметрах: fieldTitle - поле в БД, compareOperator - условие, valueToCompare - значение по которому сравниваем)
    loadFilteredData(fieldTitle, compareOperator, valueToCompare) {
        const q = query(this.dbCollection, where(fieldTitle, compareOperator, valueToCompare))
        return new Promise((resolve, reject) => {
            getDocs(q)
                .then((querySnapshot) => {
                    resolve(this.getListFromSnapshot(querySnapshot))
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    // сортировка списка по fieldTitle
    loadSortedData(sortVal) {
        const q = query(this.dbCollection, orderBy(sortVal))
        return new Promise((resolve, reject) => {
            getDocs(q)
                .then((querySnapshot) => {
                    resolve(this.getListFromSnapshot(querySnapshot))
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    // метод загрузки списка по id-шкам только тех объектов которые соотв-ют списку id-шок переданному в idList (для корзины)
    loadDocumentsFromIdsList(idsList) {
        const q = query(this.dbCollection, where(documentId(), 'in', idsList))
        return new Promise((resolve, reject) => {
            getDocs(q)
                .then((querySnapshot) => {
                    resolve(this.getListFromSnapshot(querySnapshot))
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
}

export default DbOperations
//========================================================================================================================================================
// import firebaseDB from '@/firebase-config'
// import {
//     doc,
//     collection,
//     getDocs,
//     getDoc,
//     addDoc,
//     arrayUnion,
//     arrayRemove,
//     deleteDoc,
//     updateDoc,
//     setDoc,
//     query,
//     where,
//     documentId,
// } from 'firebase/firestore/lite'

// class DbOperations {
//     constructor(collectionTitle) {
//         this.dbCollection = collection(firebaseDB, `/${collectionTitle}`)
//     }
//     getListFromSnapshot(snapshot) {
//         const list = []
//         snapshot.docs.forEach((doc) => {
//             list.push({
//                 id: doc.id,
//                 ...doc.data(),
//             })
//         })
//         return list
//     }
//     loadItemsList() {
//         return new Promise((resolve, reject) => {
//             getDocs(this.dbCollection)
//                 .then((querySnapshot) => {
//                     resolve(this.getListFromSnapshot(querySnapshot))
//                 })
//                 .catch((error) => {
//                     reject(error)
//                 })
//         })
//     }

//     addItem(item) {
//         return new Promise((resolve, reject) => {
//             addDoc(this.dbCollection, item)
//                 .then(() => {
//                     resolve(true)
//                 })
//                 .catch((error) => {
//                     reject(error)
//                 })
//         })
//     }
//     addItemWithCustomId(id, item) {
//         return new Promise((resolve, reject) => {
//             setDoc(doc(this.dbCollection, id), item)
//                 .then(() => {
//                     resolve(true)
//                 })
//                 .catch((error) => {
//                     reject(error)
//                 })
//         })
//     }
//     //  addItemToArray(id, arrayProperty, value) {
//     //      return new Promise((resolve, reject) => {
//     //          this.getItemById(id).then((item) => {
//     //              if (item[arrayProperty]) {
//     //                  updateDoc(doc(this.dbCollection, id), {
//     //                      [arrayProperty]: arrayUnion(value),
//     //                  })
//     //                      .then(() => {
//     //                          resolve(true)
//     //                      })
//     //                      .catch((error) => {
//     //                          reject(error)
//     //                      })
//     //              } else {
//     //                  this.addItemWithCustomId(id, {
//     //                      [arrayProperty]: [value],
//     //                  })
//     //                      .then(() => {
//     //                          resolve(true)
//     //                      })
//     //                      .catch((error) => {
//     //                          reject(error)
//     //                      })
//     //              }
//     //          })
//     //      })
//     //  }
//     addItemToArray(id, arrayProperty, value) {
//         return new Promise((resolve, reject) => {
//             this.getItemById(id).then((item) => {
//                 // в нашем случае if(item.card) если есть поле card - массив товаров в корзине для юзера с id, то в массив arrayProperty закидываем value
//                 if (item[arrayProperty]) {
//                     const findObj = item[arrayProperty].find((el) => el.id === value.id)
//                     if (findObj) {
//                         findObj.count++
//                         updateDoc(doc(this.dbCollection, id), {
//                             [arrayProperty]: [{ ...findObj }],
//                         })
//                             // updateDoc(doc(this.dbCollection, id), {
//                             //     [arrayProperty]: arrayUnion(value),
//                             // })
//                             .then(() => {
//                                 resolve(true)
//                             })
//                             .catch((error) => {
//                                 reject(error)
//                             })
//                     } else {
//                         updateDoc(doc(this.dbCollection, id), { [arrayProperty]: arrayUnion({ ...value, count: 1 }) })
//                             // this.addItemWithCustomId(id, {
//                             //     [arrayProperty]: [value],
//                             // })
//                             .then(() => {
//                                 resolve(true)
//                             })
//                             .catch((error) => {
//                                 reject(error)
//                             })
//                     }
//                 } else {
//                     this.addItemWithCustomId(id, { [arrayProperty]: [{ ...value, count: 1 }] })
//                         //   this.addItemWithCustomId(id, {
//                         //       [arrayProperty]: [value],
//                         //   })
//                         .then(() => {
//                             resolve(true)
//                         })
//                         .catch((error) => {
//                             reject(error)
//                         })
//                 }
//             })
//         })
//     }
//     removeItemFromArray(id, arrayProperty, value) {
//         return new Promise((resolve, reject) => {
//             updateDoc(doc(this.dbCollection, id), {
//                 [arrayProperty]: arrayRemove(value),
//             })
//                 .then(() => {
//                     resolve(true)
//                 })
//                 .catch((error) => {
//                     reject(error)
//                 })
//         })
//     }
//     deleteItem(id) {
//         return new Promise((resolve, reject) => {
//             deleteDoc(doc(this.dbCollection, id))
//                 .then(() => {
//                     resolve(true)
//                 })
//                 .catch((error) => {
//                     reject(error)
//                 })
//         })
//     }

//     updateItem(itemId, data) {
//         return new Promise((resolve, reject) => {
//             const oldDocRef = doc(this.dbCollection, itemId)
//             updateDoc(oldDocRef, data)
//                 .then(() => {
//                     resolve(true)
//                 })
//                 .catch((error) => {
//                     reject(error)
//                 })
//         })
//     }
//     getItemById(itemId) {
//         return new Promise((resolve, reject) => {
//             const docRef = doc(this.dbCollection, itemId)
//             getDoc(docRef)
//                 .then((docSnap) => {
//                     if (docSnap.exists()) resolve(docSnap.data())
//                     else resolve({})
//                 })
//                 .catch((error) => {
//                     reject(error)
//                 })
//         })
//     }
//     loadFilteredData(fieldTitle, compareOperator, valueToCompare) {
//         const q = query(this.dbCollection, where(fieldTitle, compareOperator, valueToCompare))
//         return new Promise((resolve, reject) => {
//             getDocs(q)
//                 .then((querySnapshot) => {
//                     resolve(this.getListFromSnapshot(querySnapshot))
//                 })
//                 .catch((error) => {
//                     reject(error)
//                 })
//         })
//     }
//     loadDocumentsFromIdsList(idsList) {
//         const q = query(this.dbCollection, where(documentId(), 'in', idsList))
//         return new Promise((resolve, reject) => {
//             getDocs(q)
//                 .then((querySnapshot) => {
//                     resolve(this.getListFromSnapshot(querySnapshot))
//                 })
//                 .catch((error) => {
//                     reject(error)
//                 })
//         })
//     }
// }

// export default DbOperations
