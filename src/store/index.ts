import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { clearUser, setUser, updateUser } from './features/user/userSlice';
import { updateAllPages, setSelectedPage } from './features/allpages/allpages';
import { updateEditor, setSelectedElementId } from './features/editor/editor';
const useStoreconfig = () => {
    const user = useSelector((state: any) => state.user);
    const allpages = useSelector((state: any) => state.allpages);
    const editor = useSelector((state: any) => state.editor);
    const dispatch = useDispatch();
    return {
        user,
        setUser: (data: any) => dispatch(setUser(data)),
        clearUser: () => dispatch(clearUser()),
        updateUser: (data: any) => dispatch(updateUser(data)),
        allpages,
        updateAllPages: (data: any) => dispatch(updateAllPages(data)),
        setSelectedPage: (data: number) => dispatch(setSelectedPage(data)),
        editor,
        updateEditor: (data: any) => dispatch(updateEditor(data)),
        setSelectedElementId: (data: number) => dispatch(setSelectedElementId(data)),
    }
}

export default useStoreconfig