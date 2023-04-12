import axios from 'axios'
import { del, get, post, put } from './api_helpers'

export const getTagData = () => get('/getTagList')
