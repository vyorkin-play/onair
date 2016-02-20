import sortBy from 'lodash/sortBy';
import CycleHTTPDriver from '@cycle/http';
import CycleDOM, {
  h,
  div,
  dl,
  dt,
  dd,
  input,
  label,
  ul,
  li,
  p,
  a,
  img,
} from '@cycle/dom';

import Rx from 'rx';
import styles from './styles';

function style(name) {
  const className = styles[name];
  return `.${className}`;
}

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

  return ul(style('on-air'), sortedChannels.map(streamChannel));
}

function streamChannel(channel) {
  return li(style('stream'), [
    a(style('watch'), { href: channel.url, target: '_blank' }, [
      img(style('preview'), {
        src: channel.cover,
        width: 240,
        height: 200
      })
    ]),
    channelInfo(channel)
  ]);
}

function channelInfo(channel) {
  return div(style('info'), [
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
const ENDPOINT_URL = 'https://api.twitch.tv/kraken/search/channels?limit=30&q=';
const CLIENT_ID = '57pvj6z1nfoaf62few2xnzro1q7mnka';

function intent(DOMSource) {
  const query$ = DOMSource
    .select(style('query'))
    .events('input')
    .debounce(1000)
    .map(e => e.target.value)
    .startWith(QUERY);

  return { query$ };
}

function model(query$, response$) {
  const requests$ = query$.map(query => ({
    url: ENDPOINT_URL + (query || QUERY),
    headers: {
      Accept: 'application/vnd.twitchtv.v3+json',
      'Client-ID': CLIENT_ID
    }
  }));

  return {
    requests$,
    stream$: response$.map(r => r.body).startWith(null)
  };
}

function view(stream$) {
  return stream$.map(data =>
    div(style('dashboard'), [
      label(style('label'), 'on air'),
      input(style('query'), { placeholder: QUERY }),
      data ? streamChannels(data) : null
    ])
  );
}

export default ({ HTTP, DOM, props }) => {
  const response$$ = HTTP.filter(
    response$ => response$.request.url.startsWith(ENDPOINT_URL)
  ).switch();

  const { query$ } = intent(DOM);
  const { requests$, stream$ } = model(query$, response$$);
  const vtree$ = view(stream$);
  
  return {
    DOM: vtree$,
    HTTP: requests$
  };
}
