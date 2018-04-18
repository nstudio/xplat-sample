import * as admin from 'firebase-admin';

let firebaseRef: admin.firestore.Firestore = null;

export function connectToFirebase(firebaseKey: string): admin.firestore.Firestore {
  if (!firebaseRef) {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseKey)
    });
    firebaseRef = admin.firestore();
  }

  return firebaseRef;
}

export async function getFirebaseUserFromToken(token: string): Promise<admin.auth.UserRecord> {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return await admin.auth().getUser(decodedToken.uid);
  } catch (ex) {
    console.error(ex);
    return null;
  }
}

// this will be used throughout the codebase to access firebase
export function db(): admin.firestore.Firestore {
  if (!firebaseRef) {
    throw new Error('You need to call connectToDb(accountKey) before using db()');
  }

  return firebaseRef;
}

export interface QueryParams {
  match?: any;
  limit?: number;
  returnOne?: boolean;
}

export function docSnapshotToData(doc: FirebaseFirestore.DocumentSnapshot): any {
  const docData = doc.data();
  docData.id = doc.id;
  return docData;
}

export async function addToCollection(collectionName: string, data: any): Promise<any> {
  // this is needed to ensure we have pure json sent to firebase
  const createData = JSON.parse(JSON.stringify(data));
  createData.createDate = new Date();

  const id = data.id;
  delete data.id;

  const coll = db().collection(collectionName);
  let ref: FirebaseFirestore.DocumentReference;

  if (id) {
    ref = coll.doc(id);
    await ref.set(data);
  } else {
    ref = await coll.add(createData);
  }

  const docSnapshot = await ref.get();
  return docSnapshotToData(docSnapshot);
}

export async function updateDocInCollection(collectionName: string, docId: string, updates: any): Promise<any> {
  // this is needed to ensure we have pure json sent to firebase
  const updateData = JSON.parse(JSON.stringify(updates));

  await db()
    .collection(collectionName)
    .doc(docId)
    .set(updateData, { merge: true });

  const docSnapshot = await db()
    .collection(collectionName)
    .doc(docId)
    .get();

  return docSnapshotToData(docSnapshot);
}

export function getQuerySnapshot(collectionName: string, params: QueryParams = {}): Promise<FirebaseFirestore.QuerySnapshot> {
  const { match, limit } = params;
  let query = db()
    .collection(collectionName)
    .offset(0);

  Object.keys(match || {}).forEach(key => {
    query = query.where(key, '==', match[key]);
  });

  if (limit) {
    query = query.limit(limit);
  }

  return query.get();
}

export async function queryCollection(collectionName: string, params: QueryParams): Promise<any[]> {
  // if matching to an id, just get that specific document
  if (params && params.match && params.match.id) {
    const doc = await db()
      .collection(collectionName)
      .doc(params.match.id)
      .get();
    return [docSnapshotToData(doc)];
  }

  // else it is an actual query so get all the docs and return an array
  const snapshot = await getQuerySnapshot(collectionName, params);
  const docs = snapshot.docs || [];
  return docs.map(doc => docSnapshotToData(doc));
}

export async function deleteDocFromCollection(collectionName: string, docId: string): Promise<FirebaseFirestore.WriteResult> {
  return db()
    .collection(collectionName)
    .doc(docId)
    .delete();
}

export async function deleteDocsFromCollection(collectionName: string, params: QueryParams): Promise<FirebaseFirestore.WriteResult[]> {
  const snapshot = await getQuerySnapshot(collectionName, params);

  if (!snapshot.size) {
    return;
  }

  const batch = db().batch();
  snapshot.docs.forEach(doc => batch.delete(doc.ref));
  return batch.commit();
}
