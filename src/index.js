import sortBy from 'lodash/sortBy';
import Cycle from '@cycle/core';
import CycleHTTPDriver, { makeHTTPDriver } from '@cycle/http';
import CycleDOM, {
  h,
  div,
  dl,
  dt,
  dd,
  input,
  label,
  button,
  ul,
  li,
  p,
  a,
  img,
  makeDOMDriver
} from '@cycle/dom';

import Rx from 'rx';
import styles from './index.css';

function channelCoverImage(channel) {
  return channel.video_banner ||
    channel.profile_banner ||
    channel.logo;
}

function channelRating(channel) {
  return Number(channel.views) + Number(channel.followers);
}

function streamChannels(data) {
  const channels = data.channels
    .map(channel => ({
      ...channel,
      cover: channelCoverImage(channel),
      rating: channelRating(channel)
    })).filter(({ cover }) => Boolean(cover));

  const sortedChannels = sortBy(channels, c => -c.rating);

  return ul('.on-air', sortedChannels.map(streamChannel));
}

function streamChannel(channel) {
  return li('.stream', [
    a('.watch', { href: channel.url }, [
      img('.preview', {
        src: channel.cover,
        width: 240,
        height: 200
      })
    ]),
    channelInfo(channel)
  ]);
}

function channelInfo(channel) {
  return div('.info', [
    dl([
      dt('views'),
      dd(String(channel.views)),

      dt('followers'),
      dd(String(channel.followers)),

      dt('language'),
      dd('English')
    ])
  ]);
}

const QUERY = 'cs';
const ENDPOINT_URL = 'https://api.twitch.tv/kraken/search/channels?q=';
const CLIENT_ID = '57pvj6z1nfoaf62few2xnzro1q7mnka';

const timerEvent$ = Rx.Observable.timer(0, 2000);

function main(sources) {
  const queryChangeEvent$ = sources.DOM
    .select('.query')
    .events('input')
    .map(e => e.target.value);

  const requests$ = Rx.Observable.combineLatest(
    queryChangeEvent$.startWith(QUERY),
    timerEvent$.startWith(1),
    (query, tick) => ({
      url: ENDPOINT_URL + (query || QUERY),
      headers: {
        Accept: 'application/vnd.twitchtv.v3+json',
        'Client-ID': CLIENT_ID
      }
    })
  );

  const response$$ = sources.HTTP.filter(
    response$ => response$.request.url.startsWith(ENDPOINT_URL)
  );

  const response$ = response$$.switch();
  const stream$ = response$.map(r => r.body).startWith(null);

  return {
    DOM: stream$.map(data =>
      div('.dashboard', [
        label('.label', 'watch query'),
        input('.query', { placeholder: QUERY }),
        data ? streamChannels(data) : null
      ])
    ),
    HTTP: requests$
  };
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver()
};

Cycle.run(main, drivers);
