const lensList = {
  get: (state) => state.list,
  set: (state, childState) => ({
    isAddingStart: false,
    list: childState
  })
};

const lensAdd = {
  get: (state) => state,
  set: (state, childState) => childState
}

export {
  lensList,
  lensAdd
}