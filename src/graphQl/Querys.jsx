import { gql } from "@apollo/client";

export const getVideos = gql`
query getVideos($modulo: String, $subModulo: String, $ambiente: String) {
  videos(
    first: 999999
    stage: DRAFT
    where: {modulo: $modulo, AND: {subModulo: $subModulo, AND: {ambiente: $ambiente}}}
  ) {
    id
    titulo
    modulo
    subModulo
    url
  }
}
`;

export const getModulos = gql`
query getModulos {
  modulos(first: 999999, stage: DRAFT) {
    nome
  }
}
`;

export const getSubModulos = gql`
query getSubModulos {
  subModulos(first: 999999, stage: DRAFT) {
    nome
  }
}
`;

export const getAmbientes = gql`
query getAmbientes {
  ambientes(first: 999999, stage: DRAFT) {
    nome
  }
}
`;




