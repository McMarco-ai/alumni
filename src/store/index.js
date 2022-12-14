import Vue from "vue";
import Vuex from "vuex";

//import { UserService } from '@/services/user.service';
import { AuthService } from "@/services/auth.service";
import { UserService } from "@/services/user.service";
import { LinkService } from "@/services/link.service";
import { CursoService } from "@/services/curso.service";
import { SkillService } from "@/services/skill.service";
import { ToolService } from "@/services/tool.service";
import { TestimonyService } from "@/services/testemunha.service.js";
import { BolsaService } from "@/services/bolsas.service";
import { EventoService } from "@/services/evento.service";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    alumnis: [],
    userSkills: [],
    userTools: [],
    userCursos: [],
    userLinks: [],
    userAvailableSkills: [],
    userAvailableTools: [],
    userAvailableLinks: [],
    userAvailableCursos: [],
    loggedAlumniInformation: null,
    loggedProfessorInformation: null,
    userInformationByNumeroEstudante: "",
    loggedUser: localStorage.getItem("loggedUser")
      ? JSON.parse(localStorage.getItem("loggedUser"))
      : null,
    bolsas: [],
    activeBolsa: [],
    companies: localStorage.getItem("companies")
      ? JSON.parse(localStorage.getItem("companies"))
      : [
          {
            id_company: 1,
            name: "Blip",
            phone: "932499526",
            email: "communications@blip.pt",
            locality: "Porto"
          },
          {
            id_company: 2,
            name: "Moxy",
            phone: "913845397",
            email: "communications@moxy.pt",
            locality: "Porto"
          },
          {
            id_company: 3,
            name: "XD Software",
            phone: "913845397",
            email: "communications@xdsoftware.pt",
            locality: "Braga"
          }
        ],
    activeCompany: [],
    testimonies: [],
    events: localStorage.getItem("events")
      ? JSON.parse(localStorage.getItem("events"))
      : [
          {
            id: 1,
            name: "Plug-IN",
            type: "workshop",
            location: { city: "P??voa de Varzim" },
            state: "active",
            date: "2021-06-25",
            hour: "13:56:00",
            img: require("@/assets/img/eventos/evento1.webp"),
            description:
              "Participa no plug-in, o evento certo para encontrar o emprego certo. Inscreve-te j??!"
          },
          {
            id: 2,
            name: "Web Summit",
            type: "simeira",
            location: { city: "Lisboa" },
            state: "active",
            date: "2021-09-01",
            hour: "13:45:00",
            img: require("@/assets/img/eventos/evento2.webp"),
            description:
              "A Web Summit ?? a maior confer??ncia da Europa em tecnologias, realizada anualmente desde 2009. Aparece!"
          }
        ],
    activeEvent: [],
    categories: [
      {
        id: 1,
        name: "Full-Time"
      },

      {
        id: 2,
        name: "Part-Time"
      },
      {
        id: 3,
        name: "Est??gios Profissionais"
      }
    ],
    eventTypes: [
      {
        id: 1,
        value: "workshop",
        text: "WorkShops"
      },

      {
        id: 2,
        value: "seminario",
        text: "Semin??rios"
      },

      {
        id: 3,
        value: "simeira",
        text: "Simeiras"
      }
    ]
  },
  getters: {
    getLoggedUser: state => state.loggedUser,
    isLoggedAlumni: state =>
      state.loggedUser === null
        ? false
        : state.loggedUser.userType === "alumni"
        ? true
        : false,
    isLoggedProfessor: state =>
      state.loggedUser === null
        ? false
        : state.loggedUser.userType === "professor"
        ? true
        : false,
    getLoggedAlumniInformation: state => state.loggedAlumniInformation,
    getLoggedProfessorInformation: state => state.loggedProfessorInformation,
    getAllAlumniInformation: state => {
      if (state.alumnis !== null) {
        return state.alumnis.filter(alumni => {
          if (state.loggedUser !== null) {
            if (state.loggedUser.userType === "alumni") {
              /* Quando ?? o alumni n??o retornar o pr??pio */
              return (
                parseInt(alumni.id_nroEstudante) !==
                parseInt(state.loggedUser.id)
              );
            }
          }
          /* Quando n??o h?? user logged in ou ?? professor n??o h?? filtro. */
          return true;
        });
      } else {
        return [];
      }
    },

    getUserInformationByNumeroEstudante: state =>
      state.userInformationByNumeroEstudante,
    getUserToolsByNumeroEstudante: state => state.userTools,
    getUserLinksByNumeroEstudante: state => state.userLinks,
    getUserSkillsByNumeroEstudante: state => state.userSkills,
    getUserCursosByNumeroEstudante: state => state.userCursos,
    getUserAvailableLinksByNumeroEstudante: state => state.userAvailableLinks,
    getUserAvailableCursosByNumeroEstudante: state => state.userAvailableCursos,
    getUserAvailableSkillsByNumeroEstudante: state => state.userAvailableSkills,
    getUserAvailableToolsByNumeroEstudante: state => state.userAvailableTools,

    getToolsAvailable: state =>
      state.tools /* Get de todas as tools que podem ser adicionadas no perfil de um utilizador */,

    getCategoriesForSelect: state =>
      state.categories.map(category => ({
        value: category.id,
        text: category.name
      })),

    getCompaniesForSelect: state =>
      state.companies.map(company => ({
        value: company.id_company,
        text: company.name
      })),

    getNextCompanyId: state => {
      return state.companies.length > 0
        ? state.companies[state.companies.length - 1].id_company + 1
        : 1;
    },

    getAllBolsaInformation: state => {
      return state.bolsas;
    },

    getCategories(state) {
      return state.categories;
    },

    getBolsas: state => {
      return state.bolsas;
    },

    getActiveBolsa: state => {
      return state.activeBolsa;
    },

    getCompanies: state => {
      return state.companies;
    },

    getActiveCompany: state => {
      return state.activeCompany;
    },

    getCategoryById: state => id => {
      const categoryById = state.categories.find(
        category => category.id === id
      );
      return categoryById;
    },

    getCompanyById: state => id => {
      const companyById = state.companies.find(
        company => company.id_company === id
      );
      return companyById;
    },

    getEvents: state => {
      return state.events;
    },

    getEventTypes: state => {
      return state.eventTypes;
    },

    getEventLocations: state => {
      let citys = [];
      state.events.forEach(event => {
        citys.some(city => city === event.location.city)
          ? {}
          : citys.push(event.location.city);
      });

      return citys;
    },

    getNextEventId: state => {
      return state.events.length
        ? state.events[state.events.length - 1].id + 1
        : {};
    },

    getTestimonies: state => {
      return state.testimonies;
    },

    getBolsaById: state => id => {
      const bolsaById = state.bolsas.find(bolsa => bolsa.id === id);
      return bolsaById;
    },
    getBolsasFiltered: state => (id_tipoEmprego, locality, _sort) => {
      const cards_filtered = state.bolsas.filter(
        bolsa => bolsa.id_tipoEmprego == id_tipoEmprego || id_tipoEmprego == ""
      );
      const companies = state.companies;
      var cards_filtered1 = [];
      for (var bolsa in cards_filtered) {
        for (var company in companies) {
          if (
            cards_filtered[bolsa].id_empresa == companies[company].id_company &&
            companies[company].locality.toUpperCase().includes(locality)
          ) {
            cards_filtered1.push(cards_filtered[bolsa]);
          }
        }
      }

      return cards_filtered1.sort((a, b) => {
        if (a.data_publicacao > b.data_publicacao) return -1 * _sort;
        if (a.data_publicacao < b.data_publicacao) return 1 * _sort;
        return 0;
      });
    },
    getEventById: state => id => {
      return state.events.find(e => e.id == id);
    },
    getActiveEvent: state => {
      return state.activeEvent;
    }
  },
  actions: {
    async RemoveAlumniLoggedCursoById(context, cursoId) {
      await UserService.removeAlumniCursoById(
        context.state.loggedUser,
        cursoId
      );

      /* Trigar o update dos user cursos e dos available cursos. */
      context.dispatch(
        "RetrieveUserCursosByNumeroEstudante",
        context.state.loggedUser.id
      );
      context.dispatch(
        "RetrieveUserAvailableCursosByNumeroEstudante",
        context.state.loggedUser.id
      );
    },
    async AdicionarAlumniLoggedCursoById(context, curso) {
      await UserService.addAlumniCursoById(
        context.state.loggedUser,
        curso.id_cursos,
        curso.anoCurso
      );

      /* Trigar o update dos user cursos e dos available cursos. */
      context.dispatch(
        "RetrieveUserCursosByNumeroEstudante",
        context.state.loggedUser.id
      );
      context.dispatch(
        "RetrieveUserAvailableCursosByNumeroEstudante",
        context.state.loggedUser.id
      );
    },
    async RemoveAlumniLoggedSkillById(context, linkId) {
      await UserService.removeAlumniSkillById(context.state.loggedUser, linkId);

      /* Trigar o update dos user skills e dos available skills. */
      context.dispatch(
        "RetrieveUserSkillsByNumeroEstudante",
        context.state.loggedUser.id
      );
      context.dispatch(
        "RetrieveUserAvailableSkillsByNumeroEstudante",
        context.state.loggedUser.id
      );
    },
    async AdicionarAlumniLoggedToolById(context, tool) {
      await UserService.addAlumniToolById(
        context.state.loggedUser,
        tool.id_tools,
        tool.percentagem
      );

      /* Trigar o update dos user tools e dos available tools. */
      context.dispatch(
        "RetrieveUserToolsByNumeroEstudante",
        context.state.loggedUser.id
      );
      context.dispatch(
        "RetrieveUserAvailableToolsByNumeroEstudante",
        context.state.loggedUser.id
      );
    },
    async UpdateAlumniLoggedToolById(context, tool) {
      await UserService.updateAlumniToolById(
        context.state.loggedUser,
        tool.id_tools,
        tool.percentagem
      );

      /* Trigar o update dos user tools e dos available tools. */
      context.dispatch(
        "RetrieveUserToolsByNumeroEstudante",
        context.state.loggedUser.id
      );
      context.dispatch(
        "RetrieveUserAvailableToolsByNumeroEstudante",
        context.state.loggedUser.id
      );
    },
    async RemoveAlumniLoggedToolById(context, toolId) {
      await UserService.removeAlumniToolById(context.state.loggedUser, toolId);

      /* Trigar o update dos user links e dos available links. */
      context.dispatch(
        "RetrieveUserToolsByNumeroEstudante",
        context.state.loggedUser.id
      );
      context.dispatch(
        "RetrieveUserAvailableToolsByNumeroEstudante",
        context.state.loggedUser.id
      );
    },
    async AdicionarAlumniLoggedSkillById(context, skill) {
      await UserService.addAlumniSkillById(
        context.state.loggedUser,
        skill.id_skills,
        skill.percentagem
      );

      /* Trigar o update dos user skills e dos available skills. */
      context.dispatch(
        "RetrieveUserSkillsByNumeroEstudante",
        context.state.loggedUser.id
      );
      context.dispatch(
        "RetrieveUserAvailableSkillsByNumeroEstudante",
        context.state.loggedUser.id
      );
    },
    async UpdateAlumniLoggedSkillById(context, skill) {
      await UserService.updateAlumniSkillById(
        context.state.loggedUser,
        skill.id_skills,
        skill.percentagem
      );

      /* Trigar o update dos user skills e dos available skills. */
      context.dispatch(
        "RetrieveUserSkillsByNumeroEstudante",
        context.state.loggedUser.id
      );
      context.dispatch(
        "RetrieveUserAvailableSkillsByNumeroEstudante",
        context.state.loggedUser.id
      );
    },
    async RemoveAlumniLoggedLinkById(context, linkId) {
      await UserService.removeAlumniLinkById(context.state.loggedUser, linkId);

      /* Trigar o update dos user links e dos available links. */
      context.dispatch(
        "RetrieveUserLinksByNumeroEstudante",
        context.state.loggedUser.id
      );
      context.dispatch(
        "RetrieveUserAvailableLinksByNumeroEstudante",
        context.state.loggedUser.id
      );
    },
    async AdicionarAlumniLoggedLinkById(context, link) {
      await UserService.addAlumniLinkById(
        context.state.loggedUser,
        link.id_links,
        link.url
      );

      /* Trigar o update dos user links e dos available links. */
      context.dispatch(
        "RetrieveUserLinksByNumeroEstudante",
        context.state.loggedUser.id
      );
      context.dispatch(
        "RetrieveUserAvailableLinksByNumeroEstudante",
        context.state.loggedUser.id
      );
    },
    async RetrieveAllAlumniInformation(context, filtros) {
      let data = await UserService.fetchAllAlumni(
        context.state.loggedUser,
        filtros
      );

      context.commit("ALL_ALUMNI_INFORMATION", JSON.parse(data));
    },
    async RetrieveUserInformationByNumeroEstudante(context, numeroEstudante) {
      if (context.state.loggedUser !== null) {
        if (context.state.loggedUser.userType === "alumni") {
          let data = await UserService.fetchAlumniById(
            context.state.loggedUser,
            numeroEstudante
          );

          context.commit("USER_INFORMATION_BY_ID", JSON.parse(data));
        }
      }
    },
    async RetrieveLoggedUserInformation(context) {
      if (context.state.loggedUser !== null) {
        if (context.state.loggedUser.userType === "alumni") {
          let data = await UserService.fetchAlumniById(
            context.state.loggedUser,
            context.state.loggedUser.id
          );

          context.commit("LOGGED_ALUMNI_INFORMATION", JSON.parse(data));
        } else if (context.state.loggedUser.userType === "professor") {
          let data = await UserService.fetchProfessorById(
            context.state.loggedUser,
            context.state.loggedUser.id
          );

          context.commit("LOGGED_PROFESSOR_INFORMATION", JSON.parse(data));
        }
      }
    },
    async RetrieveUserAvailableSkillsByNumeroEstudante(
      context,
      numeroEstudante
    ) {
      let data = await SkillService.fetchAlumniAvailableSkillsById(
        context.state.loggedUser,
        numeroEstudante
      );

      context.commit("USER_AVAILABLE_SKILLS_BY_ID", JSON.parse(data));
    },
    async RetrieveUserAvailableToolsByNumeroEstudante(
      context,
      numeroEstudante
    ) {
      let data = await ToolService.fetchAlumniAvailableToolsById(
        context.state.loggedUser,
        numeroEstudante
      );

      context.commit("USER_AVAILABLE_TOOLS_BY_ID", JSON.parse(data));
    },
    async RetrieveUserAvailableCursosByNumeroEstudante(
      context,
      numeroEstudante
    ) {
      let data = await CursoService.fetchAlumniAvailableCursosById(
        context.state.loggedUser,
        numeroEstudante
      );

      context.commit("USER_AVAILABLE_CURSOS_BY_ID", JSON.parse(data));
    },
    async RetrieveUserAvailableLinksByNumeroEstudante(
      context,
      numeroEstudante
    ) {
      let data = await LinkService.fetchAlumniAvailableLinksById(
        context.state.loggedUser,
        numeroEstudante
      );

      context.commit("USER_AVAILABLE_LINKS_BY_ID", JSON.parse(data));
    },
    async RetrieveUserLinksByNumeroEstudante(context, numeroEstudante) {
      let data = await UserService.fetchAlumniLinksById(
        context.state.loggedUser,
        numeroEstudante
      );

      context.commit("USER_LINKS_BY_ID", JSON.parse(data));
    },
    async RetrieveUserSkillsByNumeroEstudante(context, numeroEstudante) {
      let data = await UserService.fetchAlumniSkillsById(
        context.state.loggedUser,
        numeroEstudante
      );

      context.commit("USER_SKILLS_BY_ID", JSON.parse(data));
    },
    async RetrieveUserCursosByNumeroEstudante(context, numeroEstudante) {
      let data = await UserService.fetchAlumniCursosById(
        context.state.loggedUser,
        numeroEstudante
      );

      context.commit("USER_CURSOS_BY_ID", JSON.parse(data));
    },
    async RetrieveUserToolsByNumeroEstudante(context, numeroEstudante) {
      let data = await UserService.fetchAlumniToolsById(
        context.state.loggedUser,
        numeroEstudante
      );

      context.commit("USER_TOOLS_BY_ID", JSON.parse(data));
    },
    async login(context, loginData) {
      let data = null;

      if (loginData.userType === "alumni") {
        data = await AuthService.loginAlumni(loginData.credentials);
      } else if (loginData.userType === "professor") {
        data = await AuthService.loginProfessor(loginData.credentials);
      }

      if (data !== null) {
        context.commit("LOGIN", data);
        localStorage.setItem(
          "loggedUser",
          JSON.stringify(context.state.loggedUser)
        );
        context.dispatch("RetrieveLoggedUserInformation");
      }
    },
    async logout(context) {
      context.commit("LOGOUT");
      localStorage.removeItem("loggedUser");
    },
    async register(context, payload) {
      await AuthService.register(payload);
    },
    async EditarLoggedAlumni(context, alumni) {
      await UserService.updateAlumniById(context.state.loggedUser, alumni);
    },
    async RetrieveAllBolsaInformation(context, filtros) {
      let data = await BolsaService.fetchAllBolsas(
        context.state.loggedUser,
        filtros
      );
      context.commit("ALL_BOLSA_INFORMATION", JSON.parse(data));
    },

    async RetrieveBolsaById(context, id_bolsas) {
      let data = await BolsaService.fetchBolsaById(
        context.state.loggedUser,
        id_bolsas
      );
      context.commit("BOLSA_INFORMATION", JSON.parse(data));
    },

    async EditBolsa(context, bolsa) {
      console.log(context.state.activeBolsa.id_bolsas);
      await BolsaService.editBolsa(
        context.state.loggedUser,
        context.state.activeBolsa.id_bolsas,
        bolsa
      );
    },

    async createBolsa(context, bolsa) {
      await BolsaService.createBolsa(context.state.loggedUser, bolsa);
    },

    async fetchAllTestimonies(context) {
      let data = await TestimonyService.getAllTestimonies();
      context.commit("SET_TESTIMONIES", JSON.parse(data));
    },

    saveBolsa(context, bolsa) {
      context.commit("SAVE_BOLSA", bolsa);
    },
    setActiveBolsa(context, bolsa) {
      context.commit("SET_ACTIVE_BOLSA", bolsa);
    },
    /*
               editBolsa(context, bolsa) {
                 context.commit("EDIT_BOLSA", bolsa);
               },*/
    async deleteBolsa(context, id_bolsas) {
      await BolsaService.deleteBolsa(context.state.loggedUser, id_bolsas);
    },
    createCompany(context, company) {
      context.commit("CREATE_COMPANY", company);
    },
    setActiveCompany(context, company) {
      context.commit("SET_ACTIVE_COMPANY", company);
    },
    editCompany(context, company) {
      context.commit("EDIT_COMPANY", company);
    },
    deleteCompany(context, id) {
      context.commit("DELETE_COMPANY", id);
    },
    saveTestimony(context, testimony) {
      context.commit("SAVE_TESTIMONY", testimony);
    },
    async createEvento(context, evento) {
      await EventoService.createEvento(context.state.loggedUser, evento);
    },

    setActiveEvent(context, event) {
      context.commit("SET_ACTIVE_EVENT", event);
    },
    async deleteEvento(context, id_evento) {
      await EventoService.deleteEvento(context.state.loggedUser, id_evento);
    },
    async EditEvento(context, evento) {
      console.log(context.state.activeEvent.id_evento);
      await EventoService.EditEvento(
        context.state.loggedUser,
        context.state.activeEvent.id_evento,
        evento
      );
    },
    async subscribeEvent(context, event_id) {
      context.commit("SUBSCRIBE_EVENT", event_id, context.state.loggedUser);
    },
    async RetrieveAllEventos(context, filtros) {
      let data = await BolsaService.getAllEventos(
        context.state.loggedUser,
        filtros
      );
      context.commit("ALL_EVENTO_INFORMATION", JSON.parse(data));
    },
    async RetrieveEventoById(context, id_evento) {
      let data = await BolsaService.fetchEventoById(
        context.state.loggedUser,
        id_evento
      );
      context.commit("EVENTO_INFORMATION", JSON.parse(data));
    }
  },
  mutations: {
    ALL_ALUMNI_INFORMATION(state, data) {
      state.alumnis = data;
    },
    USER_INFORMATION_BY_ID(state, data) {
      state.userInformationByNumeroEstudante = data;
    },
    USER_AVAILABLE_TOOLS_BY_ID(state, data) {
      state.userAvailableTools = data;
    },
    USER_AVAILABLE_SKILLS_BY_ID(state, data) {
      state.userAvailableSkills = data;
    },
    USER_AVAILABLE_CURSOS_BY_ID(state, data) {
      state.userAvailableCursos = data;
    },
    USER_AVAILABLE_LINKS_BY_ID(state, data) {
      state.userAvailableLinks = data;
    },
    USER_SKILLS_BY_ID(state, data) {
      state.userSkills = data;
    },
    USER_LINKS_BY_ID(state, data) {
      state.userLinks = data;
    },
    USER_CURSOS_BY_ID(state, data) {
      state.userCursos = data;
    },
    USER_TOOLS_BY_ID(state, data) {
      state.userTools = data;
    },
    LOGGED_ALUMNI_INFORMATION(state, data) {
      state.loggedAlumniInformation = data;
    },
    LOGGED_PROFESSOR_INFORMATION(state, data) {
      state.loggedProfessorInformation = data;
    },
    LOGIN(state, data) {
      state.loggedUser = JSON.parse(data);
    },
    LOGOUT(state) {
      state.loggedUser = null;
    },
    ALL_BOLSA_INFORMATION(state, data) {
      state.bolsas = data;
    },
    BOLSA_INFORMATION(state, data) {
      state.activeBolsa = data;
    },
    SAVE_BOLSA(state, bolsa) {
      state.bolsas.push(bolsa);
      localStorage.setItem("bolsas", JSON.stringify(state.bolsas));
    },
    REMOVE_BOLSA(state, id) {
      state.bolsas = state.bolsas.filter(bolsa => bolsa.id != id);

      localStorage.setItem("bolsas", JSON.stringify(state.bolsas));
    },
    SET_ACTIVE_BOLSA(state, bolsa) {
      state.activeBolsa = bolsa;
    },
    EDIT_BOLSA(state, bolsa) {
      state.bolsas = state.bolsas.filter(b => b.id != bolsa.id);
      state.bolsas.push(bolsa);
      localStorage.setItem("bolsas", JSON.stringify(state.bolsas));
    },

    CREATE_COMPANY(state, company) {
      state.companies.push(company);
      localStorage.setItem("companies", JSON.stringify(state.companies));
    },
    DELETE_COMPANY(state, id) {
      state.companies = state.companies.filter(
        company => company.id_company != id
      );

      localStorage.setItem("companies", JSON.stringify(state.companies));
    },
    SET_ACTIVE_COMPANY(state, company) {
      state.activeCompany = company;
    },
    EDIT_COMPANY(state, company) {
      state.companies = state.companies.filter(
        c => c.id_company != company.id_company
      );
      state.companies.push(company);
      localStorage.setItem("companies", JSON.stringify(state.companies));
    },

    SET_TESTIMONIES(state, testimonies) {
      state.testimonies = testimonies;
    },

    SAVE_EVENT(state, event) {
      state.events.push(event);
      localStorage.setItem("events", JSON.stringify(state.events));
    },
    SET_ACTIVE_EVENT(state, event) {
      state.activeEvent = event;
    },
    EVENT_INFORMATION(state, data) {
      state.activeEvent = data;
    },
    ALL_EVENT_INFORMATION(state, data) {
      state.evento = data;
    },

    DELETE_EVENT(state, event) {
      state.events = state.events.filter(object => object != event);
      localStorage.setItem("events", JSON.stringify(state.events));
    },
    EDIT_EVENT(state, event) {
      state.events = state.events.filter(e => e.id != event.id);
      state.events.push(event);
      localStorage.setItem("events", JSON.stringify(state.events));
    },
    SUBSCRIBE_EVENT(state, event) {
      console.log(state + " " + event); // temporario para nao dar erro por nao ser utilizado os parametros
    }
  }
});
