/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { useReducerLocalStorage } from 'util/useLocalStorage';
import { ChapterListOptions, ChapterOptionsReducerAction, ChapterSortMode, IChapter, NullAndUndefined } from 'typings';

const defaultChapterOptions: ChapterListOptions = {
    active: false,
    unread: undefined,
    downloaded: undefined,
    bookmarked: undefined,
    reverse: false,
    sortBy: 'source',
    showChapterNumber: false,
};

function chapterOptionsReducer(state: ChapterListOptions, actions: ChapterOptionsReducerAction): ChapterListOptions {
    switch (actions.type) {
        case 'filter':
            // eslint-disable-next-line no-case-declarations
            const active = state.unread !== false && state.downloaded !== false && state.bookmarked !== false;
            return {
                ...state,
                active,
                [actions.filterType!]: actions.filterValue,
            };
        case 'sortBy':
            return { ...state, sortBy: actions.sortBy };
        case 'sortReverse':
            return { ...state, reverse: !state.reverse };
        case 'showChapterNumber':
            return { ...state, showChapterNumber: !state.showChapterNumber };
        default:
            throw Error('This is not a valid Action');
    }
}

export function unreadFilter(unread: NullAndUndefined<boolean>, { read: isChapterRead }: IChapter) {
    switch (unread) {
        case true:
            return !isChapterRead;
        case false:
            return isChapterRead;
        default:
            return true;
    }
}

function downloadFilter(downloaded: NullAndUndefined<boolean>, { downloaded: chapterDownload }: IChapter) {
    switch (downloaded) {
        case true:
            return chapterDownload;
        case false:
            return !chapterDownload;
        default:
            return true;
    }
}

function bookmarkedFilter(bookmarked: NullAndUndefined<boolean>, { bookmarked: chapterBookmarked }: IChapter) {
    switch (bookmarked) {
        case true:
            return chapterBookmarked;
        case false:
            return !chapterBookmarked;
        default:
            return true;
    }
}

export function filterAndSortChapters(chapters: IChapter[], options: ChapterListOptions): IChapter[] {
    const filtered = options.active
        ? chapters.filter(
              (chp) =>
                  unreadFilter(options.unread, chp) &&
                  downloadFilter(options.downloaded, chp) &&
                  bookmarkedFilter(options.bookmarked, chp),
          )
        : [...chapters];
    const Sorted = options.sortBy === 'fetchedAt' ? filtered.sort((a, b) => a.fetchedAt - b.fetchedAt) : filtered;
    if (options.reverse) {
        Sorted.reverse();
    }
    return Sorted;
}

export const useChapterOptions = (mangaId: string) =>
    useReducerLocalStorage<ChapterListOptions, ChapterOptionsReducerAction>(
        chapterOptionsReducer,
        `${mangaId}filterOptions`,
        defaultChapterOptions,
    );

export const SORT_OPTIONS: [ChapterSortMode, string][] = [
    ['source', 'By Source'],
    ['fetchedAt', 'By Fetch date'],
];

export const isFilterActive = (options: ChapterListOptions) => {
    const { unread, downloaded, bookmarked } = options;
    return unread != null || downloaded != null || bookmarked != null;
};
